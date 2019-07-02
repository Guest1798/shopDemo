var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/goods', { useNewUrlParser: true }, function (err) {
    if (err) {
        console.log('Connection Error:' + err);
    } else {
        console.log('MongoDB goodsDB Connection success!');
    }
});

var goodsSchema = new mongoose.Schema({
	id:{
		type:Number
	},
    goodsname: {
        type: String,
        required: [true, "商品名不能为空"]
    },
    price: {
        type: Number
    },
    created_time: {
        type: Date,
        default: Date.now
    },
    last_modified_time: {
        type: Date,
        default: Date.now
    },
    status: {
		//转态
        type: Number,
        enum: [0, 1, 2],
        default: 0
    },
    kind: {
        type: Array,
        default: []
    },
	stock:{
		type:Number,
		min:0
	}
});

module.exports = mongoose.model('goods', userSchema);
