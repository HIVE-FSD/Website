const mongoose = require('mongoose');

const buzzSpaceSchema = new mongoose.Schema({
    cover: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    },
    numberOfMembersJoined: {
        type: Number,
        default: 0
    },
    numberOfPosts: {
        type: Number,
        default: 0
    }
});

const BuzzSpace = mongoose.model('BuzzSpace', buzzSpaceSchema);

module.exports = BuzzSpace;
