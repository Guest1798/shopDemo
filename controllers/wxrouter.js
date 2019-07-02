var express = require('express');
var router = express.Router();
var fs = require("fs");
var path = require('path');
//var User = require('../models/user');
// var Goods = require('../models/goods');
var md5 = require('blueimp-md5');

//微信小程序路由
router.get('/wx/', function (req, res) {
    var data = [{
        name: "blessleon",
        age: 18,
        gender: "boy"
    },
    {
        name: "reberk",
        age: 23,
        gender: "girl"
    }
    ];
    res.json(data);
});
router.post('/wx/', function (req, res) {
    console.log(req.body);
});
router.get('/wx/query', function (req, res) {
    
    var datas=[];
    fs.readFile("./public/datas/zoldata.json", function (err,data) {
        if (err) {
            console.log("读文件错误" + err);
        } else {
            datas=JSON.parse(data.toString("utf-8"));
            res.json(datas);
        }
    }); 
    console.log("被请求");
});


//导出模块
module.exports = router;
