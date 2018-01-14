const express = require('express');
const router = express.Router();

const INIT_RPC = {
	token: "asdjkasl5465asd4as5",
	time: 10000
};

const ACTIONS_LIST = {
	"ARTICLE_QUERY": {
		action: "ARTICLE_QUERY"
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

// 文章
router.get('/', (req, res) => {
	let key = 'ARTICLE_QUERY';
	let query = req.params;
	ACTIONS_LIST[key] ? ACTIONS_LIST[key].data = query : ACTIONS_LIST[key] = {};
	thriftRPC_JX.send(toString(key), function (err, data) {
		data && res.json(parse(data).data);
	}, thriftRPC_JX.platform);
});

module.exports = router;
