const mongoose = require('mongoose');

const buzzSchema = new mongoose.Schema({
    buzzSpaceName: {
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
        required: false
    }
})
const Buzz = mongoose.model('Buzz', buzzSchema);

module.exports = Buzz;