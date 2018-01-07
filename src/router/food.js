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
	}
};

// Thrift RPC Client
const thriftRPC = require('../rpcClient');

const stringify = JSON.stringify;
const parse = JSON.parse;

const toString = function (key) {
	let rpc_data = Object.assign(ACTIONS_LIST[key], INIT_RPC);
	return stringify(rpc_data);
};


// router configuration
router.get('/:id', (req, res) => {
	let key = 'food_getById';
	let data = req.params;
	ACTIONS_LIST[key] ? ACTIONS_LIST[key].data = data : ACTIONS_LIST[key] = {};
	thriftRPC.send(toString(key), function (err, data) {
	    data && res.json(parse(data));
	});
});

// 商家某菜单下的商品
router.get('/category/:id/foods', (req, res) => {
	let key = 'food_selectByCategory';
	let data = req.params;
	ACTIONS_LIST[key] ? ACTIONS_LIST[key].data = data : ACTIONS_LIST[key] = {};
	thriftRPC.send(toString(key), function (err, data) {
	    data && res.json(parse(data));
	});
});


module.exports = router;
