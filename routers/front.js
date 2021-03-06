const express = require('express');
const router = express.Router();
const User = require('../models/User');
const crypto = require('crypto');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
const gm = require('gm');
const Classify = require('../models/Classify');
const Content = require('../models/Content');

let responseData = {};

router.use((req, res, next) => {
    responseData = req.responseData
    Classify.find().then(doc => {
        responseData.classifies = doc;
        next();
    });
});

// 首页
router.get('/', (req, res) => {
    // 先找出所有内容，返回内容的 classify 值和请求到的 id 相等的内容
    let {classifyid, pageNow=1} = req.query;
    let where = {};
    // 访问首页的时候不会走这里，where 为空对象刚好是查询全部
    if(classifyid) {
        where.classify = classifyid;
    }

    Content.where(where).countDocuments().then(counts => {
        let limit = 2;
        let pages = Math.ceil(counts / limit); // 总页数

        pageNow = Math.max(pageNow, 1); // 最小
        pageNow = Math.min(pageNow, pages); // 最大

        Content.find().where(where).limit(limit).populate(['user']).then(contents => {
            // console.log(responseData.classifies, 233);
            res.render('front/frame', {
                page: "index",
                userInfo: req.session.userInfo,
                classifies: responseData.classifies,
                classifyid: classifyid, // 做 active 用的
                contents,
                pageNow,
                limit,
                pages,
                counts
            });
        });
    });

    
    
});

// 详情
router.get('/details', (req, res) => {
    let {contentid, classifyid} = req.query;
    Content.findOne({
        _id: contentid
    }).populate(['user']).then(content => {
        // console.log(content, 222);
        res.render('front/frame', {
            page: "details",
            userInfo: req.session.userInfo,
            classifies: responseData.classifies,
            content: content,
            classifyid
        });    
    });
});

// 后端验证
function checkRegInfo (req, res, next) {
    let {username, password, repassword} = req.body;
    if(username === "" || password === "") {
        responseData.code = 1;
        responseData.msg = '用户名或密码不能为空';
        return res.json(responseData);
    }
    if(password !== repassword) {
        responseData.code = 1;
        responseData.msg = '密码和确认密码不一样';
        return res.json(responseData);
    }
    next();
}

// 注册
router.post('/reg', checkRegInfo, (req, res) => {
    let {username, password} = req.body;

    // 先查询数据库中有没有这个人
    User.findOne({
        username
    }).then(findRes => {
        if(findRes) {
            responseData.code = 1;
            responseData.msg = '用户名已存在';
            return res.json(responseData);
        }

        let hmac = crypto.createHmac('sha1', 'weixian');
        hmac.update(password);
        password = hmac.digest('hex');// 搞成16进制，默认是 buffer
        // 没有的话再保存
        User.create({
            username,
            password
        }).then(saveRes => {
            responseData.msg = '注册成功';
            return res.json(responseData);
        });
    });
});


// 验证登录信息，待验证
function checkLoginInfo(req, res, next) {
    // 待优化
    let {username, password, repassword} = req.body;
    if(username === "" || password === "") {
        responseData.code = 1;
        responseData.msg = '用户名或密码不能为空';
        return res.json(responseData);
    }
    next();
}

// 登录
router.post('/login',checkLoginInfo, (req, res) => {
    let {username, password} = req.body;
    let hmac = crypto.createHmac('sha1', 'weixian');
    hmac.update(password);
    password = hmac.digest('hex');// 搞成16进制，默认是 buffer

    User.findOne({
        username,
        password
    }).then(findRes => {
        if(findRes) {
            let {_id, username, isAdmin,avatar} = findRes;

            // 登录的时候设置 session 到 cookie
            req.session.userInfo = {_id,username,isAdmin,avatar};
            req.session.userInfo.cutTip = '点击头像可以上传';
            responseData.msg = '登录成功';
            return res.json(responseData);
        } else {
            responseData.code = 1;
            responseData.msg = '用户名或密码错误';
            return res.json(responseData);
        }
    });
});

// 退出
router.get('/logout', (req, res) => {
    req.session.userInfo = null;
    responseData.msg = '退出成功';
    return res.json(responseData);
});


// 上传头像
router.post('/upload', (req, res) => {
    let form = new formidable.IncomingForm();
    form.uploadDir = path.join(__dirname, '/../public/upload');
    form.parse(req, (err, fields, files) => {
        let extName = path.extname(files.avatar.name),
            oldFile = files.avatar.path,
            fileName = Math.random() + extName,
            newFile = path.join(__dirname, '/../public/upload/') + fileName;
            
            fs.rename(oldFile, newFile, err => {
                if(err) {
                    responseData.code = 1;
                    responseData.msg = '上传成功，但改名失败了';
                    return res.json(responseData);
                }

                // 这里考虑是不是和下面的代码优化一下
                // 上传头像名存入数据库，登录成功后再取出
                User.update({
                    _id: req.session.userInfo._id
                }, {
                    '$set': {
                        avatar: fileName
                    }
                }).then(res => {
                    // console.log(res, 2333);
                });

                // 上传成功，改名成功后把图片改成需要的大小，很关键！！
                gm(newFile).resize(264)// 等比变成宽度264
                .crop(264, 264, 0, 0)// 保留高度264，使不溢出
                .write(newFile, function (err) {
                    if (err) {
                        responseData.code = 1;
                        responseData.msg = '缩放图片失败';
                        return res.json(responseData);
                    }
                    // 上传头像的时候是会走这里
                    // console.log('2333');
                    // 记录下头像名
                    req.session.userInfo.avatar = fileName;
                    req.session.userInfo.cutTip = '裁剪头像';
                    // 前端拿到这个名字也可以进行更新，也可以reload一下
                    responseData.avatar = fileName;
                    responseData.msg = '已改成目标大小';
                    return res.json(responseData);
                });
            });
    });
});

// 裁剪头像
router.get('/cutimg', (req, res) => {
    let imgName = req.session.userInfo.avatar,
        w = req.query.w,
        h = req.query.h,
        x = req.query.x,
        y = req.query.y,
        newFile = path.join(__dirname, '/../public/upload/') + imgName;
        console.log(x, y, w, h, imgName);
        gm(newFile).crop(w, h, x, y)
        .resize(70, 70, "!")// "!"表示强制缩放成目标大小
        .write(newFile, function (err) {
            if (err) {
                responseData.code = 1;
                responseData.msg = '裁剪失败';
                return res.json(responseData);
            }
            responseData.msg = '裁剪成功';
            req.session.userInfo.cutTip = '再次上传头像后可以裁剪';
            res.json(responseData);
        });
});

// 评论
router.post('/comment', (req, res) => {
    let {commentCon,contentId} = req.body;
    
    // 根据内容 ID 查到内容里面的 comments
    Content.findOne({
        _id: contentId
    }).then(content => {
        // 每一条评论都应该有自己的用户相关的信息，因为每一篇文章下面可以有不同的用户进行评论
        content.comments.push({
            user: req.session.userInfo,
            content: commentCon,
            commentTime: new Date().getTime()
        });
        return content.save(); // 或者create
    }).then(newContent => {
        // save 的结果
        responseData.msg = '评论成功';
        responseData.comments = newContent.comments;
        res.json(responseData);
    });
});


module.exports = router;