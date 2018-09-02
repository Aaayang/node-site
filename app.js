const mongoose = require('mongoose');
const express = require('express');
const app = express();
const config = require('./config');

// 以 public 开头的静态目录
app.use('/public', express.static('public'));

// 模板配置
app.engine('html', require('ejs').__express);
app.set('view engine', 'html');

app.get('/', (req, res) => {
    res.render('index', {
        name: 'aaayang'
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
