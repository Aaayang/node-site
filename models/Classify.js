const mongoose = require('mongoose');
const classifiesSchema = require('../schemas/classifies');

module.exports = mongoose.model('Classify', classifiesSchema);