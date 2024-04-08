const mongoose = require('mongoose');

const buzzSchema = new mongoose.Schema({
    buzzSpace: {
        type: mongoose.Types.ObjectId,
        ref: 'BuzzSpace',
        required: false
    },
    title: {
        type: String,
        required: true
    },
    buzz: {
        type: String,
        required: true
    },
    buzzer: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    },
    buzzedon: {
        type: Date,
        default: Date.now
    },
    votes: {
        type: Number,
        default: 0
    },
    comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }]
})
const Buzz = mongoose.model('Buzz', buzzSchema);

module.exports = Buzz;