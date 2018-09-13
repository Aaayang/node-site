const mongoose = require('mongoose');

module.exports = new mongoose.Schema({
    // 分类，注意这个值必须是 Classify 存在的 ID
    classify: {
        type: mongoose.Schema.Types.ObjectId,
        // mongoose.model('Classify', classifiesSchema);
        ref: 'Classify'
    },
    // 标题
    title: String,
    // 简介
    description: {
        type: String,
        default: ''
    },
    // 内容
    content: {
        type: String,
        default: ''
    },
    // 用户
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // 添加时间
    addTime: {
        type: Date,
        default: new Date()
    },
    // 访问量
    views: {
        type: Number,
        default: 0
    },
    // 评论
    comments: {
        type: Array,
        default: []
    }
});