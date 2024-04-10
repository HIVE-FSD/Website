const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    buzz: {
        type: mongoose.Types.ObjectId,
        ref: 'Buzz',
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    buzzer: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    commentedon: {
        type: Date,
        default: Date.now
    },
    upvotes: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    downvotes: [{
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }],
    replies: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }]
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
