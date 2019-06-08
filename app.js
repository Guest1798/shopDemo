//依赖
var express = require("express");
var fs = require("fs");
var app = express();
var path = require("path");
var router = require("./controllers/router");
var bodyParser = require("body-parser");
let expressSession = require('express-session');



app.engine('html', require('express-art-template'));

app.use('/public/', express.static(path.join(__dirname, './public/')));
app.set('views', path.join(__dirname, './views/'));
// app.set('views cache', true);
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')));
app.use(bodyParser.urlencoded({ extended: false }));

//使用express-session 中间件
app.use(expressSession({
    //cookie的名字
    name: "pbk",
    //cookie签名的信息
    secret: 'secret',
    //cookie的有效时间 3分钟
    cookie: {
        maxAge: 1000 * 60 * 10,
    },
    //即使session的信息没有变化，也会重新保存session
    resave: false,
    //如果saveUninitialized为true，他会将没有初始化的session的数据保存到storage中
    saveUninitialized: false,
    //主要作用：每次请求都重置cookie过期时间
    rolling: true,
    //指定session数据存储的地方(数据库),默认情况下session会话数据是保存在服务器的内存中
    store: null
}));

app.use(router);

//错误处理
app.use(function (err, req, res, next) {
    res.status(200).json({
        err_code: 500,
        message: err
    });
});

app.listen(4500, function () {
    console.log("服务已在4500端口启动");
});