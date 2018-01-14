const express = require('express');
const router = express.Router();

const INIT_RPC = {
	token: "asdjkasl5465asd4as5",
	time: 10000
};

const ACTIONS_LIST = {
	"ORDER_UPDATE": {
        // 注册
		action: "ORDER_UPDATE"
    },
    "ORDER_QUERY": {
        // 更新用户信息
        action: "ORDER_QUERY"
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

//更新订单信息
router.get('/order', (req, res) => {
	let key = 'ORDER_UPDATE';
	// ACTIONS_LIST[key].data = {
    //     orderId: "zero"
	// }
	// ACTIONS_LIST[key] ? ACTIONS_LIST[key].data = query : ACTIONS_LIST[key] = {};
	thriftRPC_JX.send(toString(key), function (err, data) {
		data && res.json(parse(data));
    }, thriftRPC_JX.platform);
});

//查询订单信息
router.get('/query', (req, res) => {
	let key = 'ORDER_QUERY';
	// ACTIONS_LIST[key].data = {
	// 	orderId: "zero"
	// }
	// ACTIONS_LIST[key] ? ACTIONS_LIST[key].data = query : ACTIONS_LIST[key] = {};
	thriftRPC_JX.send(toString(key), function (err, data) {
		data && res.json(parse(data));
    }, thriftRPC_JX.platform);
});

module.exports = router;
