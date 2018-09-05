const express = require('express');
const router = express.Router();
const User = require('../models/User');
const crypto = require('crypto');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');

let responseData = {};
router.use((req, res, next) => {
    responseData.code = 0;
    responseData.msg = '';
    next();
});

// 首页
router.get('/', (req, res) => {
    res.render('index', {
        userInfo: req.session.userInfo
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
            responseData.msg = '登录成功';
            return res.json(responseData);
        } else {
            responseData.code = 1;
            responseData.msg = '用户名或密码错误';
            return res.json(responseData);
        }
    });
});

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
                // 记录下头像名
                req.session.userInfo.avatar = fileName;
                responseData.avatar = fileName;
                responseData.msg = '上传并改名成功';
                return res.json(responseData);
            });
    });
})

module.exports = router;