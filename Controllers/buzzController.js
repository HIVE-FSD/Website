const Buzz = require('../models/Buzz');
const BuzzSpace = require('../models/BuzzSpace');
const User = require('../models/User');

const createBuzz = async (req, res) => {
    try {
        const { buzzSpace, buzz, title, buzzer } = req.body;
        const newBuzz = new Buzz({
            buzzSpace: buzzSpace,
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
    const{title, buzz} = req.body;
    const buzzId = req.params.id;
    let buzz1;
    try{
        buzz1 = await Buzz.findByIdAndUpdate(buzzId, {
            title,
            buzz
        })
    }catch(err){
        return console.log(err);
    }
    if(!buzz1) return res.status(500).json({message: "Error updating Buzz"})

    return res.status(200).json({buzz1})
}

async function getBuzzsWithComments(buzzIds) {
    try {
        const buzzes = [];
        for (const buzzId of buzzIds) {
            const buzz = await Buzz.findById(buzzId).populate({
                path: 'comments',
                populate: {
                    path: 'replies'
                }
            });
            
            const formattedComments = buzz.comments.map(comment => formatComment(comment));
            let buzzSpace = await BuzzSpace.findById(buzz.buzzSpace);
            let buzzer = await User.findById(buzz.buzzer);
            buzzes.push({
                id: buzz._id,
                buzzSpace:  buzzSpace.name,
                buzzedon: buzz.buzzedon,
                title: buzz.title,
                votes: buzz.votes,
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

async function formatComment (comment) {
    const formattedReplies = comment.replies.map(reply => formatComment(reply));
    let buzzer = await User.findById(comment.buzzer);
    return {
        id: comment._id,
        buzz: comment.buzz,
        buzzer: buzzer.info,
        comment: comment.comment,
        votes: comment.votes,
        commentedon: comment.commentedon,
        replies: formattedReplies
    };
}

module.exports = { createBuzz, editBuzz, getBuzzsWithComments };
