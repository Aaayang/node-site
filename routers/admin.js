const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Classify = require('../models/Classify');
const Content = require('../models/Content');

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


// ...................................分类相关开始...................................
// 分类添加页面
router.get('/classifyadd', (req, res) => {
    res.render('admin/frame', {
        page: "classifyadd"
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
            responseData.msg = '分类添加成功';
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
    // 当前页
    let {pageNow=1} = req.query;

    Classify.countDocuments().then(counts => {
        // 每页显示条数
        let limit = 5;
        // 总共多少页
        let pages = Math.ceil(counts / limit);

        // 最小是 1
        pageNow = Math.max(pageNow, 1);
        // 最大是 pages
        pageNow = Math.min(pageNow, pages);

        // 跳过多少条
        let skip = (pageNow - 1) * limit;
        

        Classify.find().limit(limit).skip(skip).then(doc => {
            res.render('admin/frame', {
                page: "classifylist",
                classifies: doc,
                counts: counts,
                pageNow: pageNow,
                limit: limit,
                pages: pages
            });    
        }).catch(err => {
            console.log(err);
        });
    })
});
// 分类删除
router.get('/classifydelete', (req, res) => {
    let {id} = req.query;
    Classify.deleteOne({
        _id: id
    }).then(doc => {
        responseData.title = '成功提示';
        responseData.msg = '删除成功';
        responseData.url = '/admin/classifylist';
        res.render('admin/frame', {
            page: 'msgtip',
            responseData
        });
    });
});
// 分类修改
router.get('/classifymodify', (req, res) => {
    let {id} = req.query;
    Classify.findOne({
        _id: id
    }).then(doc => {
        res.render('admin/frame', {
            id: id,
            page: "classifymodify",
            name: doc.name
        });
    });
});
// 修改分类名称
router.post('/classifymodify', (req, res) => {
    let {id, classifyname} = req.body;

    // 先查看是否存在
    // 一定是查 ID，证明有没有改动
    Classify.findOne({
        _id: id
    }).then(doc => {
        if(classifyname === doc.name) {
            // 说明没有改动
            responseData.title = '成功提示';
            responseData.msg = '你没有进行任何修改';
            responseData.url = '/admin/classifylist';
            res.render('admin/frame', {
                page: 'msgtip',
                responseData
            });
            return Promise.reject('没有改动');
        } else {
            // 说明改动了，再看改动后的名称数据库中是否存在
            return Classify.findOne({
                name: classifyname
            })
        }
    }).then(doc => {
        if(doc) {
            // 数据库中存在，说明重名了
            responseData.title = '错误提示';
            responseData.msg = '已经有相同名称，不能重复';
            responseData.url = '/admin/classifylist';
            res.render('admin/frame', {
                page: 'msgtip',
                responseData
            });
            return Promise.reject('已经有相同名称');
        } else {
            // 正常修改
            return Classify.updateOne({
                _id: id
            }, {
                '$set': {
                    name: classifyname
                }
            })
        }
    }).then(doc => {
        responseData.title = '成功提示';
        responseData.msg = '修改成功';
        responseData.url = '/admin/classifylist';
        res.render('admin/frame', {
            page: 'msgtip',
            responseData
        });
    }).catch(err => {
        console.log(err);
    });
});
// ...................................分类相关结束...................................


// ...................................内容相关开始...................................
// 内容添加页面
router.get('/contentadd', (req, res) => {
    Classify.find().then(classifies => {
        res.render('admin/frame', {
            page: "contentadd",
            classifies: classifies
        });
    });
});
// 内容添加接口
router.post('/contentadd', (req, res) => {
    // 验空

    // 分类、标题、描述、内容，用户、添加时间、访问量、评论
    let {contentclassify, contenttitle, contentdesc, contentcon} = req.body;
    
    Content.create({
        classify: contentclassify,
        title: contenttitle,
        description: contentdesc,
        content: contentcon,
        user: req.session.userInfo._id // 注意是从 session 中拿的，考虑是否可以优化？
    }).then(doc => {
        
    }).catch(err => {
        console.log(err);
    });
    
    responseData.title = '成功提示';
    responseData.msg = '内容添加成功';
    responseData.url = '/admin/contentlist';
    responseData.name = 'xxx';
    res.render('admin/frame', {
        page: 'msgtip',
        responseData
    });
});

// 内容列表
router.get('/contentlist', (req, res) => {
    // 当前页
    let {pageNow=1} = req.query;

    Classify.countDocuments().then(counts => {
        // 每页显示条数
        let limit = 5;
        // 总共多少页
        let pages = Math.ceil(counts / limit);

        // 最小是 1
        pageNow = Math.max(pageNow, 1);
        // 最大是 pages
        pageNow = Math.min(pageNow, pages);

        // 跳过多少条
        let skip = (pageNow - 1) * limit;
        

        Classify.find().limit(limit).skip(skip).then(doc => {
            res.render('admin/frame', {
                page: "contentlist",
                classifies: doc,
                counts: counts,
                pageNow: pageNow,
                limit: limit,
                pages: pages
            });    
        }).catch(err => {
            console.log(err);
        });
    })
});
// ...................................内容相关结束...................................



module.exports = router;