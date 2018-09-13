const mongoose = require('mongoose');

let contentSchema = require('../schemas/contents');

module.exports = mongoose.model('Content', contentSchema);