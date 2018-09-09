const express = require('express');
const router = express.Router();

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
    res.render('admin/frame', {
        page: "userlist",
    });
});



// 分类添加
router.get('/classifyadd', (req, res) => {
    res.render('admin/frame', {
        page: "classifyadd",
    });
});
// 分类列表
router.get('/classifylist', (req, res) => {
    res.render('admin/frame', {
        page: "classifylist",
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