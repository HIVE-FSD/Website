const Buzz = require('../models/Buzz');
const Comment = require('../models/Comment');
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
    const { buzz, userId, buzzID } = req.body;
    let buzz1;
    const buzzobj = await Buzz.findById(buzzID)
    try {
        if(userId == buzzobj.buzzer) {
            buzz1 = await Buzz.findByIdAndUpdate(buzzID, {buzz}, { new: true }); // Use buzzId consistently
        }
    } catch (err) {
        return console.log(err);
    }
    if (!buzz1) return res.status(500).json({ message: "Error updating Buzz" })

    return res.status(200).json({ buzz1 })
}


const deleteBuzz = async(req, res) => {
    const {userId, buzzId} = req.body;
    let buzz1;
    try{
        buzz1 = await Buzz.findById(buzzId);
        if(buzz1.buzzer == buzz1.buzzSpace.creator || buzz1.buzzer == userId){
            await Buzz.findByIdAndDelete(buzzId)
            await User.findByIdAndUpdate(userId, {
                $pull: { buzz_ids: buzzId },
                $inc: { 'info.buzz_count': -1 }
            });

        }else{
            return res.status(500).json({ message: "You cannot delete the Buzz" })
        }
    }catch(err){
        console.log(err);
    }
    return res.status(200).json({ buzz1 })
}

async function getBuzzsWithComments(buzzIds, _id) {
    try {
        const buzzes = [];
        for (const buzzId of buzzIds) {
            const buzz = await Buzz.findById(buzzId);
            const formattedCommentsPromises = buzz.comments.map(async comment => await formatComment(comment, _id));
            const formattedComments = await Promise.all(formattedCommentsPromises);

            let buzzSpace = await BuzzSpace.findById(buzz.buzzSpace);
            let buzzer = await User.findById(buzz.buzzer);
            let votes = buzz.upvotes.length - buzz.downvotes.length
            let upvoted = false
            let downvoted = false
            let canDelete = false
            let canEdit = false
            if (buzz.upvotes.includes(_id)) {
                upvoted = true
            }
            if (buzz.downvotes.includes(_id)) {
                downvoted = true
            }
            if (buzz.buzzer.toString() === _id.toString()) {
                canDelete = true
                canEdit = true
            } else if (buzzSpace.creator.toString() === _id.toString()) {
                canDelete = true                
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
                comments: formattedComments,
                canDelete,
                canEdit
            });
        }
        return buzzes;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function formatComment(commentId, _id) {
    const comment = await Comment.findById(commentId)
    const formattedRepliesPromises = comment.replies.map(async reply => await formatComment(reply, _id));
    const formattedReplies = await Promise.all(formattedRepliesPromises);
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


// Function to filter buzz posts based on date
const filterBuzzPostsByDate = async (date, buzzSpaceIds) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    try {
        const posts = await Buzz.find({
            buzzedon: {
                $gte: startOfDay,
                $lte: endOfDay
            },
            buzzSpace: { $in: buzzSpaceIds } 
        }).limit(10);

        return posts;
    } catch (error) {
        console.error('Error filtering posts:', error);
        throw error;
    }
};


// Function to fetch recent posts
const fetchRecentPosts = async (buzzSpaceIds) => {
    const now = new Date();
    let recentPosts = [];
    const HalfaYear = new Date();
    HalfaYear.setDate(HalfaYear.getDate() - 183);

    while (recentPosts.length < 10 && now > HalfaYear) {
        const filteredPosts = await filterBuzzPostsByDate(now, buzzSpaceIds);

        if (filteredPosts.length > 0) {
            // Extract only the 'id' field from each post
            const postIds = filteredPosts.map(post => post.id);
            recentPosts.push(...postIds);
        }

        now.setDate(now.getDate() - 1); // Move to the previous day
    }

    // Slice the array to get only the first 10 post IDs
    recentPosts = recentPosts.slice(0, 10);

    return recentPosts;
};



module.exports = { createBuzz, editBuzz, getBuzzsWithComments, fetchRecentPosts, deleteBuzz};
