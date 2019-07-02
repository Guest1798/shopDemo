//依赖
var express = require("express");
var app = express();
var path = require("path");
var router = require("./controllers/router");
var wxrouter = require("./controllers/wxrouter");
var bodyParser = require("body-parser");
var expressSession = require('express-session');



//后台渲染引擎
app.engine('html', require('express-art-template'));
//静态资源目录
app.use('/public/', express.static(path.join(__dirname, './public/')));
app.use('/node_modules/', express.static(path.join(__dirname, './node_modules/')));
app.set('views', path.join(__dirname, './views/'));
//设置缓存
app.set('views cache', true);
app.use(bodyParser.urlencoded({ extended: false }));
//使用express-session 中间件
app.use(expressSession({
    name: "pbk",
    //cookie签名的信息
    secret: 'secret',
    cookie: {
        maxAge: 1000 * 60 * 10,
    },
    resave: false,
    saveUninitialized: false,
    rolling: true,
    store: null
}));


app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Content-type');
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS,PATCH");
    res.header('Access-Control-Max-Age',6000);//预请求缓存10分钟
    next();  
});


app.use(router);//pc网页路由
app.use(wxrouter);//微信小程序路由



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