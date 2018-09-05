const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    username: String,
    password: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: "avatar.jpg"
    }
});