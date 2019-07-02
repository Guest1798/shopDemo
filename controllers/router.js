var express = require('express');
var router = express.Router();
var path = require('path');
var User = require('../models/user');
// var Goods = require('../models/goods');
var md5 = require('blueimp-md5');


//用户没有登陆的时候的拦截
router.use(function (req, res, next) {
    var url = req.originalUrl;
    //如果session的user存在说明登陆了
    if (req.session.user) {
        if (url.indexOf("/login") != -1) {
            res.render("index.html", {
                title: '商城首页',
                user: req.session.user,
            });
        }
        else {
            next();
        }
    }
    //没有登陆不能访问有用户信息相关的页面
    else {
        if (url.indexOf("/usercenter") != -1 || url.indexOf("/usercenter/ordered") != -1) {
            res.redirect("/login");
        }
        else {
            next();
        }
    }
});

//get请求路由
router.get('/', function (req, res) {
    res.render("index.html", {
        title: '商城首页',
        user: req.session.user,
        // goodscount: req.session.user.goods.length,
        // username: req.session.user.username,
        // goods: req.session.user.goods
    });
});
router.get('/index', function (req, res) {
    res.render("index.html", {
        title: '商城首页',
        user: req.session.user,
        // goodscount: req.session.user.goods.length,
        // username: req.session.user.username,
        // goods: req.session.user.goods
    });
});
router.get("/feedback", function (req, res) {
    res.render("feedback.html", { title: '反馈' });
});

router.get("/products", function (req, res) {
    res.render("products.html", {
        title: '全部商品',
        user: req.session.user,
        // goodscount: req.session.user.goods.length,
        // username: req.session.user.username,
        // goods: req.session.user.goods
    });
});
router.get("/usercenter", function (req, res) {
    res.render("usercenter.html", { title: '用户中心', user: req.session.user });
});
router.get("/usercenter/ordered", function (req, res) {
    res.render("usercenter.html", {
        title: '已购买商品', user: req.session.user
    });
});

//复用详情页
for (var i = 0; i < 35; i++) {
    var lj = "/products/" + i;
    router.get(lj, function (req, res) {
        var urlnow = req.originalUrl;
        var phoneid = urlnow.slice(10, urlnow.length);
        res.render("products-detail.html", {
            title: '商品详情页',
            user: req.session.user,
            pid: phoneid,
            // goodscount: req.session.user.goods.length,
            // username: req.session.user.username,
            // goods: req.session.user.goods
        });
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
                .then(function (usermsg) {
                    console.log("返回的信息", usermsg);
                    User.findOne({ username: username })
                        .then(function (data) {
                            res.status(200).json(data);//返回查找的的用户数据
                        }, function (err) {
                            console.log(err);
                        });

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
            console.log("登录的返回信息", data);
            if (data == null) {
                console.log("用户名或者密码错误");
                res.render("login.html", { err_message: "用户名或者密码错误" });
            }
            //用户名密码正确 登陆成功
            else {
                req.session.user = data;
                res.render("index.html", {
                    title: '商城首页',
                    user: req.session.user,
                    goodscount: req.session.user.goods.length,
                    username: req.session.user.username,
                    goods: req.session.user.goods
                });
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
