const express = require('express');
const router = express.Router();

const INIT_RPC = {
	token: "asdjkasl5465asd4as5",
	time: 10000
};

const ACTIONS_LIST = {
	"restaurant_selectByKeyWord": {
		action: "restaurant_selectByKeyWord"
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


module.exports = router;
