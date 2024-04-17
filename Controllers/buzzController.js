const Buzz = require('../models/Buzz');
const BuzzSpace = require('../models/BuzzSpace');
const User = require('../models/User');

const createBuzz = async (req, res) => {
    try {
        const { buzzSpace, buzz, title, buzzer } = req.body;
        const buzzSpaceInfo = await BuzzSpace.findOne({ name: buzzSpace });
        const newBuzz = new Buzz({
            buzzSpace: buzzSpaceInfo._id,
            buzz: buzz,
            title: title,
            buzzer: buzzer
        });
        await newBuzz.save();
        await User.findByIdAndUpdate(buzzer, { $push: { buzz_ids: newBuzz._id }, $inc: { 'info.buzz_count': 1 } });
        res.status(201).send('Buzz created.');
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error');
    }
};

const editBuzz = async (req, res) => {
    const { title, buzz } = req.body;
    const buzzId = req.params.id;
    let buzz1;
    try {
        buzz1 = await Buzz.findByIdAndUpdate(buzzId, {
            title,
            buzz
        })
    } catch (err) {
        return console.log(err);
    }
    if (!buzz1) return res.status(500).json({ message: "Error updating Buzz" })

    return res.status(200).json({ buzz1 })
}

async function getBuzzsWithComments(buzzIds, _id) {
    try {
        const buzzes = [];
        for (const buzzId of buzzIds) {
            const buzz = await Buzz.findById(buzzId).populate({
                path: 'comments',
                populate: {
                    path: 'replies'
                }
            });

            const formattedCommentsPromises = buzz.comments.map(async comment => await formatComment(comment, _id));
            const formattedComments = await Promise.all(formattedCommentsPromises);

            let buzzSpace = await BuzzSpace.findById(buzz.buzzSpace);
            let buzzer = await User.findById(buzz.buzzer);
            let votes = buzz.upvotes.length - buzz.downvotes.length
            let upvoted = false
            let downvoted = false
            if (buzz.upvotes.includes(_id)) {
                upvoted = true
            }
            if (buzz.downvotes.includes(_id)) {
                downvoted = true
            }
            buzzes.push({
                id: buzz._id,
                buzzSpace: buzzSpace.name,
                buzzedon: buzz.buzzedon,
                title: buzz.title,
                votes,
                upvoted,
                downvoted,
                buzz: buzz.buzz,
                buzzer: buzzer.info,
                comments: formattedComments
            });
        }
        return buzzes;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function formatComment(comment, _id) {
    const formattedReplies = comment.replies.map(async reply => await formatComment(reply, _id));
    let buzzer = await User.findById(comment.buzzer);
    let votes = comment.upvotes.length - comment.downvotes.length
    let upvoted = false
    let downvoted = false
    if (comment.upvotes.includes(_id)) {
        upvoted = true
    }
    if (comment.downvotes.includes(_id)) {
        downvoted = true
    }
    return {
        id: comment._id,
        buzz: comment.buzz,
        buzzer: buzzer.info,
        comment: comment.comment,
        votes,
        upvoted,
        downvoted,
        commentedon: comment.commentedon,
        replies: formattedReplies
    };
}

module.exports = { createBuzz, editBuzz, getBuzzsWithComments };
