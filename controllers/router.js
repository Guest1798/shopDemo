var express = require('express');
var router = express.Router();
var path = require('path');
var User = require('../models/user');
var md5 = require('blueimp-md5');


//用户没有登陆的时候的拦截
router.use((req, res, next) => {
    //获取请求路径
    var url = req.originalUrl;
    //如果session的user存在说明登陆了  登陆之后不能登陆页面
    // console.log("forbid", url, req.session.user);
    if (req.session.user) {
        if (url.indexOf("/login") != -1) {
            res.render("index.html", { user: req.session.user });
        }
        else {
            next();
        }
    }
    //没有登陆不能访问  admin  profile
    else {
        if (url.indexOf("/usercenter") != -1 || url.indexOf("/usercenter/ordered") != -1) {
            res.render("login.html");
        }
        else {
            next();
        }
    }
});

//get请求路由
router.get('/', function (req, res) {
    res.render("index.html", { title: '商城首页', user: req.session.user });
});
router.get('/index', function (req, res) {
    res.render("index.html", { title: '商城首页', user: req.session.user });
});
router.get("/feedback", function (req, res) {
    res.render("feedback.html", { title: '反馈' });
});

router.get("/products", function (req, res) {
    res.render("products.html", { title: '全部商品', user: req.session.user });
});
router.get("/usercenter", function (req, res) {
    res.render("usercenter.html", { title: '用户中心', user: req.session.user });
});
router.get("/usercenter/ordered", function (req, res) {
    res.render("usercenter.html", { title: '已购买商品', user: req.session.user });
});

//
for (var i = 0; i < 35; i++) {
    var lj = "/products/" + i;
    router.get(lj, function (req, res) {
        var urlnow = req.originalUrl;
        var phoneid = urlnow.slice(10, urlnow.length);
        res.render("products-detail.html", { title: '商品详情页', user: req.session.user, pid: phoneid });
    });
}

//添加物品到用户购物车，数据已完成
for (var i = 0; i < 35; i++) {
    var jrgwc = "/products/" + i + "/shopcart";
    router.post(jrgwc, function (req, res, next) {
        //确定用户
        if (req.session.user) {
            var urlnow = req.originalUrl;
            var phoneid = urlnow.slice(10, urlnow.length - 9);
            var username = req.session.user.username;
            User.updateOne({ username: username }, { $push: { goods: phoneid } })
                .then(function (msg) {
                    console.log(msg);
                }, function (err) {
                    console.log(err);
                });
            console.log("发送购物车请求", phoneid);
        }
        else {
            console.log("未登录状态无法添加购物车");
        }
    });
}


//get请求注册页面
router.get("/register", function (req, res) {
    res.render("register.html", { title: '注册' });
});
//post请求路由
//注册功能
router.post("/register", function (req, res, next) {
    var username = req.body.username;
    var email = req.body.email;
    User.findOne({
        $or: [{ username: username },
        { email: email }]
    }).then(function (data) {
        console.log(data);
        //存入用户数据
        if (data == null) {
            var user = new User();
            Object.assign(user, req.body);
            user.save().then(function (msg) {
                res.redirect("/login");
            }, function (err) {
                res.render("register.html", { err_message: err.message });
            });
        } else {
            res.render("register.html", { err_message: "该用户已存在！" });
        }
    }, function (err) {
        console.log(err);
    });
});

//get请求登录页面
router.get("/login", function (req, res) {
    res.render("login.html", { title: '登录' });
});
//登录请求
router.post("/login", function (req, res) {
    //获取用户名密码
    var username = req.body.username;
    var password = req.body.password;
    //根据用户名和密码查询数据库
    User.findOne({ username: username, password: password })
        .then(function (data) {
            //用户名或者密码错误 登陆失败
            console.log(data);
            if (data == null) {
                console.log("用户名或者密码错误");
                res.render("login.html", { err_message: "用户名或者密码错误" });
            }
            //用户名密码正确 登陆成功
            else {
                req.session.user = data;
                res.render("index.html", { user: req.session.user });
            }
        }, function (err) {
            console.log(err, "查询出错");
            res.render("login.html", { err_message: err.message });
        });
});

//退出登陆
router.get("/logout", (req, res) => {
    //清空session
    req.session.destroy();
    res.redirect("/index");
});

//导出模块
module.exports = router;
