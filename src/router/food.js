const express = require('express');
const router = express.Router();

const INIT_RPC = {
	token: "asdjkasl5465asd4as5",
	time: 10000
};

const ACTIONS_LIST = {
	"food_getById": {
		action: "food_getById"
	},
	"food_selectByCategory": {
		action: "food_selectByCategory"
	},
	"foodRating_condition": {
		action: "foodRating_condition"
	},
	"foodRating_add": {	// 添加商品评论
		action: "foodRating_add"
	},
	"foodRating_delete": {
		action: "foodRating_delete"
	}
};

// Thrift RPC Client
const {thriftRPC_JX, thriftRPC_YL} = require('../rpcClient')

const stringify = JSON.stringify;
const parse = JSON.parse;

const toString = function (key) {
	let rpc_data = Object.assign(ACTIONS_LIST[key], INIT_RPC);
	return stringify(rpc_data);
};


// router configuration

// 商品评价列表
router.get('/rating', (req, res) => {
	let key = 'foodRating_condition';
	let query = req.query;
	ACTIONS_LIST[key].data = {
		restaurant_id: query.id || 4,
		offset: 0,
		limit: 10,
		restaurant_rating: 1
	};
	console.dir(toString(key));
	thriftRPC_YL.send(toString(key), function(err, data) {
		data && res.json(parse(data));
	}, thriftRPC_YL.platform);
});

router.get('/:id', (req, res) => {
	let key = 'food_getById';
	let data = req.params;
	ACTIONS_LIST[key] ? ACTIONS_LIST[key].data = data : ACTIONS_LIST[key] = {};
	// console.dir(toString(key))
	thriftRPC_YL.send(toString(key), function (err, data) {
	    data && res.json(parse(data));
	}, thriftRPC_YL.platform);
});

// 商家某菜单下的商品
router.get('/category/:id/foods', (req, res) => {
	let key = 'food_selectByCategory';
	let data = req.params;
	ACTIONS_LIST[key] ? ACTIONS_LIST[key].data = data : ACTIONS_LIST[key] = {};
	thriftRPC_YL.send(toString(key), function (err, data) {
	    data && res.json(parse(data));
	}, thriftRPC_YL.platform);
});


module.exports = router;
