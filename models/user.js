var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/test', { useNewUrlParser: true }, function (err) {
    if (err) {
        console.log('Connection Error:' + err);
    } else {
        console.log('Connection success!');
    }
});

var userSchema = new mongoose.Schema({
    email: {
        type: String,
        validate: {
            validator: function (v) {
                return /^\w+@\w+\.\w+(\.\w+)?$/.test(v);
            },
            message: "邮箱格式不正确"
        },
        required: [true, '邮箱不能为空']
    },
    username: {
        type: String,
        required: [true, "用户名不能为空"]
    },
    password: {
        type: String,
        required: [true, "密码不能为空"]
    },
    created_time: {
        type: Date,
        default: Date.now
    },
    last_modified_time: {
        type: Date,
        default: Date.now
    },
    gender: {
        type: Number,
        enum: [-1, 0, 1],
        default: -1
    },
    status: {
        type: Number,
        // 0 没有权限限制
        // 1 不可以评论
        // 2 不可以登录
        enum: [0, 1, 2],
        default: 0
    },
    address: {
        type: Array,
        default: []
    },
    goods: {
        type: Array,
        default: []
    }
});

module.exports = mongoose.model('user', userSchema);
