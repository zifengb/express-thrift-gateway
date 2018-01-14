const express = require('express');
const router = express.Router();

const INIT_RPC = {
	token: "asdjkasl5465asd4as5",
	time: 10000
};

const ACTIONS_LIST = {
	"ORDER_UPDATE": {
		action: "ORDER_UPDATE"
    },
    "ORDER_QUERY": {
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
router.post('/update', (req, res) => {
	let key = 'ORDER_UPDATE';
	// console.log(req.body)

	// add
	// ACTIONS_LIST[key].data = {
	// 	address: '广东工业大学',
	// 	deliverFee: 12,
	// 	detail: stringify([
	// 		{
	// 			amount: '1', //数量
 //        food_id: '1', //商品id
 //        food_name: '猪脚饭',
 //        price: '11.0' //单价

	// 		}
	// 	]),
	// 	userId: 1,
	// 	userName: 'zizz',
	// 	restaurantId: 20,
	// 	restaurantName: "尚喜",
	// 	phoneList: stringify({
	// 		userPhone: 12123112,
	// 		restPhone: 123123132
	// 	}),
	// 	consignee: "李先生",
	// 	deliveryGeo: "150,200,300,60",
	// 	totalPrice: 12,
	// 	originalPrice: 10,
	// 	restaurantImagePath: "base64"
	// };

	// update
	// ACTIONS_LIST[key].data = {
	// 	orderId: 4,
	// 	statusCode: 2
	// };

	ACTIONS_LIST[key].data = req.body;
	console.dir(toString(key))
	thriftRPC_JX.send(toString(key), function (err, data) {
		data && res.json(parse(data));
    }, thriftRPC_JX.platform);
});

//查询订单信息
router.get('/query', (req, res) => {
	let key = 'ORDER_QUERY';
	ACTIONS_LIST[key].data = req.query;
	thriftRPC_JX.send(toString(key), function (err, data) {
		data && res.json(parse(data).data);
    }, thriftRPC_JX.platform);
});

module.exports = router;
