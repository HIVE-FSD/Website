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
        await User.findByIdAndUpdate(buzzer, {
            $push: {
                buzz_ids: { $each: [newBuzz._id], $position: 0 }
            },
            $inc: { 'info.buzz_count': 1 }
        });
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
        if (userId == buzzobj.buzzer) {
            buzz1 = await Buzz.findByIdAndUpdate(buzzID, { buzz }, { new: true }); // Use buzzId consistently
        }
    } catch (err) {
        return console.log(err);
    }
    if (!buzz1) return res.status(500).json({ message: "Error updating Buzz" })

    return res.status(200).json({ buzz1 })
}

const reportBuzz = async (req, res) => {
    const { buzzId } = req.body;
    try {
        const buzz = await Buzz.findById(buzzId);
        const buzzSpace = await BuzzSpace.findById(buzz.buzzSpace);
        const buzzer = await User.findById(buzz.buzzer)
        const notificationMessage = `Buzz ${buzz.title} in ${buzzSpace.name} buzzed by ${buzzer.info.display_name} was reported`;
        const notification = {
            type: 'buzzspace',
            message: notificationMessage
        };
        if (buzzSpace && buzzSpace.moderators && buzzSpace.moderators.length > 0) {

            try {

                for (const element of buzzSpace.moderators) {
                    try {
                        const user = await User.findById(element);
                        if (user) {
                            user.notifications.unshift(notification);
                            await user.save();
                        } else {
                            console.log("No user found.");
                        }
                    } catch (error) {
                        console.log(`Error while processing user with ID ${element}: ${error}`);
                    }
                }
                
            } catch (error) {
                console.log(`Error while processing user with ID ${element}: ${error}`);
            }
        }
        const creator = await User.findById(buzzSpace.creator)
                if(creator){
                    creator.notifications.unshift(notification);
                    await creator.save();
                }else{
                    console.log("Creator does not exist")
                }
                return res.status(201).json({ message: "Notification Sent" })
}catch (err) {
    console.log(err)
}
}

const deleteBuzz = async (req, res) => {
    const { userId, buzzId } = req.body;
    let buzz1;
    try {
        buzz1 = await Buzz.findById(buzzId);
        const buzzSpace = await BuzzSpace.findById(buzz1.buzzSpace)
        if (userId == buzzSpace.creator || buzz1.buzzer == userId) {
            await Buzz.findByIdAndDelete(buzzId)
            await Comment.deleteMany({ buzz: buzzId });
            await User.findByIdAndUpdate(buzz1.buzzer, {
                $pull: { buzz_ids: buzzId },
                $inc: { 'info.buzz_count': -1 }
            });
            
        } else {
            return res.status(500).json({ message: "You cannot delete the Buzz" })
        }
    } catch (err) {
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
            let canReport = true
            if (buzz.upvotes.includes(_id)) {
                upvoted = true
            }
            if (buzz.downvotes.includes(_id)) {
                downvoted = true
            }

            if (buzzSpace.creator.toString() === _id.toString() || buzzSpace.moderators.includes(_id)) {
                canDelete = true
                canReport = false
            }
            if (buzzSpace.moderators.includes(_id) && buzzSpace.creator.toString() === buzz.buzzer.toString()) {
                canDelete = false
            }
            if (buzzSpace.moderators.includes(_id) && buzzSpace.moderators.includes(buzz.buzzer)) {
                canReport = true
                canDelete = false
            }
            
            if (buzzSpace.creator.toString() === buzz.buzzer.toString()) {
                canReport = false
            }
            
            if (buzz.buzzer.toString() === _id.toString()) {
                canDelete = true
                canEdit = true
                canReport = false
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
                canEdit,
                canReport
            });
        }
        buzzes.sort((a, b) => {
            return new Date(b.buzzedon) - new Date(a.buzzedon);
        });
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



module.exports = { createBuzz, editBuzz, getBuzzsWithComments, fetchRecentPosts, deleteBuzz, reportBuzz };
