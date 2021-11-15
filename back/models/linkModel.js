const mongoose = require('mongoose');

const LinkSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true
    },
    token: {
        type: String,
        unique: true,
    },
    redirectCount: {
        type: Number,
        required: true,
    },
    username: {
        type: String,
    },
    creationDate: {
        type: String,
        required: true,
    }
})

module.exports = mongoose.model('Link', LinkSchema);