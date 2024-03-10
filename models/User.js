const mongoose = require('mongoose');

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
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
