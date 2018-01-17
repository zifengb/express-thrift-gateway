const express = require('express');
const router = express.Router();

const INIT_RPC = {
	token: "asdjkasl5465asd4as5",
	time: 10000
};

const ACTIONS_LIST = {
	"cart_getCart": {
		action: "cart_getCart"
	},
	"cart_add": {
		action: "cart_add"
	},
	"cart_addItem": {
		action: "cart_addItem"
	},
	"cart_updateItemCount": {
		action: "cart_updateItemCount"
	},
	"cart_deleteItem": {
		action: "cart_deleteItem"
	},
	"cart_empty": {
		action: "cart_empty"
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

// 根据用户id获取其购物车
router.get('/', (req, res) => {
	let key = 'cart_getCart';
	ACTIONS_LIST[key].data = req.query;
	thriftRPC_YL.send(toString(key), function(err, data) {
		data && res.json(parse(data).data);
	}, thriftRPC_YL.platform);
});

router.post('/save', (req, res) => {
	let key = 'cart_add';
	ACTIONS_LIST[key].data = req.body;
	thriftRPC_YL.send(toString(key), function(err, data) {
		data && res.json(parse(data).data);
	}, thriftRPC_YL.platform);
});

router.get('/clear', (req, res) => {
	let key = 'cart_empty';
	ACTIONS_LIST[key].data = req.query;
	thriftRPC_YL.send(toString(key), function(err, data) {
		data && res.json(parse(data).data);
	}, thriftRPC_YL.platform);
});


module.exports = router;
