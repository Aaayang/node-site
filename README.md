# 开发日志

## 功能

- 注册/登录

## 目录说明

- app.js：项目入口

##

长匹配短：例如 /aaa/bbb 匹配 /aaa 和 /，所以 app.use('/') 都能被匹配


## Todo

- 服务器重启登录状态保存

- 密码加密

- 页面 z-index

- 使用 sass

- 页面 calss 规整

- 预览图片位置不对

- 图片名没有更新到数据库

## xx

- 所有页面都是渲染 frame，根据 page 区分

- 参考 bootstrap 评论样式

## 后台页面

- 用户管理

    - 用户列表，修改、删除、分页
    - 添加用户

- 分类管理

    - 分类列表，修改、删除、分页
    - 添加分类

- 内容管理

    - 内容列表，修改、删除、分页
    - 添加内容

## 关于EJS

不要自作聪明的配置模板后缀，用默认的即可，不然后面IDE会很难识别你的内容，格式化代码是个问题

## 关于连接池


## 把AJAX方法提取到大的common

## 问题

关于 AJAX POST请求，后端渲染的问题？

- 前端表单格式提交，后端直接render

- 前端 AJAX 提交，后端返回数据，并更改前端当前路由的渲染页面，前端拿到数据后 reload 会从新请求路由，下次再次请求此路由地址时怎么恢复之前的页面呢？

- 后端直接 redirect 前端当前页面的路由，并更改渲染页面，前端无需刷新，下次再次请求此路由地址时怎么恢复之前的页面呢？

- innerHTML


## 添加分类

先验证之前的分类是否存在

## JPG竟然也可以动?


## 关于 Promise.reject()

## 把对数据库的操作由嵌套改成 Promise 的写法

## 分页

- pageNow: 当前页，默认从 1 开始

- limit: 每页条数

- counts: 总条数

- pages: 总页数，limit / counts

- skip: 跳过前 (pageNow - 1) * limit 条


分页时，前端索引是通过 (pageNow - 1) * limit + idx 计算得出的，也可以在数据库中加索引，可以改进


## 后端分页可以封装

## mongo 的多表联查（populate）

### step1

``` javascript
let contentSchema = new mongoose.Schema({
    // 分类，注意这个值必须是 Classify 存在的 ID
    classify: {
        type: mongoose.Schema.Types.ObjectId,
        // mongoose.model('Classify', classifiesSchema);
        ref: 'Classify'
    }
});
```

### step2

contents 表接收到的 classify 字段必须是 Classify(classifies) 表中的 id

``` javascript
module.exports = mongoose.model('Content', contentSchema);
```

### step3

正常查询得到的只是普通的 classify id，通过 populate 可以把 classify id 相关的内容也取出来

``` javascript
Content.find().limit(limit).skip(skip).populate(['classify'])
```

## 接口的管理

例如内容添加应该是 content/add 而不是 contentadd，待改进

## 分页样式统一

## 分页那里的数据返回要规整下

## 分页组件那里待优化

## 添加 comment 情况数据库

## 关联表是在已经有另外一个表的情况下才能进行关联，评论不太合适

## 区分 req.cookies.set 和 req.session 两种设置 cookie 的异同

## 区分 save 和 create 的异同