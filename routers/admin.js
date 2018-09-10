const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Classify = require('../models/Classify');

let responseData = {};
router.use((req, res, next) => {
    responseData = req.responseData
    next();
});


router.get('/', (req, res) => {
    res.render('admin/frame', {
        page: "index",
    });
});

// 用户添加
router.get('/useradd', (req, res) => {
    res.render('admin/frame', {
        page: "useradd",
    });
});
// 用户列表
router.get('/userlist', (req, res) => {
    User.find().then(userList => {
        res.render('admin/frame', {
            page: "userlist",
            userList
        });    
    });
});



// 分类添加页面
router.get('/classifyadd', (req, res) => {
    res.render('admin/frame', {
        page: "classifyadd",
    });
});

// 分类添加接口
router.post('/classifyadd', (req, res) => {
    let {classifyname} = req.body;
    Classify.find({
        name: classifyname
    }).then(doc => {
        if(doc.length) {
            responseData.title = '错误提示';
            responseData.msg = "分类已经存在，不能重复添加";
            responseData.url = '/admin/classifyadd';
            return res.render('admin/frame', {
                page: 'msgtip',
                responseData
            });
        }
        Classify.create({
            name: classifyname
        }).then(doc => {
            responseData.title = '成功提示';
            responseData.msg = '提交成功';
            responseData.url = '/admin/classifylist';
            responseData.name = doc.name;
            // 注意前端要是 form 表单形式的提交        
            res.render('admin/frame', {
                page: 'msgtip',
                responseData
            });
        });
    });
});


// 分类列表
router.get('/classifylist', (req, res) => {
    Classify.find({}).then(doc => {
        res.render('admin/frame', {
            page: "classifylist",
            classifies: doc
        });    
    });
});

// 内容添加
router.get('/contentadd', (req, res) => {
    res.render('admin/frame', {
        page: "contentadd",
    });
});
// 内容列表
router.get('/contentlist', (req, res) => {
    res.render('admin/frame', {
        page: "contentlist",
    });
});


module.exports = router;