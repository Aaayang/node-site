const mongoose = require('mongoose');
const express = require('express');
const app = express();
const session = require('express-session');
const bodyParser = require('body-parser');
const MongoStore = require('connect-mongo')(session);
const cookieParser = require('cookie-parser');
const config = require('./config');

// 解析 POST 数据
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

app.use(cookieParser());
// 配置 session
app.use(session({
    secret: config.secret,
    store: new MongoStore({
        url: config.DB_URL,
        collection: 'sessions'
    }),
    resave: true,
    saveUninitialized: true
}));

// 以 public 开头的静态目录
app.use('/public', express.static('public'));

// 模板配置
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');

// 前台
app.use('/', require('./routers/front'));
app.use('/admin', require('./routers/admin'));

// 404
app.get('*', (req, res) => {
    res.render('frame', {
        page: '404',
        userInfo: req.session.userInfo
    });
});

mongoose.connect(config.DB_URL, {
    useNewUrlParser: true
}, err => {
    if(err) {
        console.log('数据库连接失败');
    } else {
        console.log('数据库连接成功 ~');
        app.listen(config.PORT, () => {
            console.log(`listening on ${config.PORT}`);
        });
    }
});
