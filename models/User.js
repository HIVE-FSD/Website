const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    type: {
        type: mongoose.Schema.Types.Mixed,
        enum: ['post', 'buzzspace', 'comment', 'reply', 'request'], 
        required: true
    },
    message: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        default: Date.now
    },
    request: { 
        user: {
            type: mongoose.Schema.Types.Mixed,
            ref: 'User',
            required: false 
        },
        buzzspace: {
            type: String,
            required: false 
        },
        approved: {
            type: Boolean,
            default: false,
            required: false 
        }
    }
});

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    is_verified: {
        type: Boolean,
        default: false,
        required: true
    },
    info: {
        display_name: {
            type: String,
            default: "BuzzingUser"
        },
        bio: {
            type: String,
            default: ""
        },
        avatar_index: {
            type: Number,
            default: -1
        },
        buzz_count: {
            type: Number,
            default: 0
        },
        buzzSpace_count: {
            type: Number,
            default: 0
        }
    },
    buzz_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Buzz' }],
    buzzSpace_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BuzzSpace' }],
    joined_buzzSpace_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'BuzzSpace' }],
    notifications: [notificationSchema]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
