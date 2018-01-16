const express = require('express');
const router = express.Router();

const [LONGITUDE, LATITUDE] = [113.260526, 23.110616];
// const [LONGITUDE, LATITUDE] = [131.611183, 41.257839];

const INIT_RPC = {
	token: "asdjkasl5465asd4as5",
	time: 10000
};

const ACTIONS_LIST = {
	"restaurant_getById": {
		action: "restaurant_getById"
	},
	"restaurant_getDeliverAmount": {
		action: "restaurant_getDeliverAmount"
	},
	"foodCategory_selectByRestaurant": {
		action: "foodCategory_selectByRestaurant"
	},
	"restaurant_selectByKeyWord": {
		action: "restaurant_selectByKeyWord"
	},
	"restaurant_selectByRange": {
		action: "restaurant_selectByRange"
	},
	"restaurant_condition": {
		action: "restaurant_condition"
	},
	"restaurant_selectByClassification": {
		action: "restaurant_selectByClassification"
	},
	"photos_getByReId": {
		action: "photos_getByReId"
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

// 商家查询
router.get('/', (req, res) => {
	let key = 'restaurant_condition';
	let query = req.query;
	ACTIONS_LIST[key].data = {
		offset: query.offset || 0,
		limit: query.limit || 10,
		category_ids: query.category.join(','),	// 按分类查询商家
		order_by: query.order_by,
		// busy_level: query.busy_level || 0,
		// deliver_free: query.deliver_free || 0,
		// new_restaurant: query.new_restaurant || 0,
		// is_premium: query.is_premium || 0,
		longitude: query.longitude || LONGITUDE,
		latitude: query.latitude || LATITUDE
	};
	thriftRPC_YL.send(toString(key), function (err, data) {
	    data && res.json(parse(data).data);
	}, thriftRPC_YL.platform);
});

// 根据用户经纬度返回附近商家
router.get('/class', (req, res) => {
	let key = "restaurant_selectByClassification";
	ACTIONS_LIST[key].data = {
		offset: 0,
		limit: 10,
		longitude: LONGITUDE,
		latitude: LATITUDE,
		classification: req.query.classification || 1,
	};
	thriftRPC_YL.send(toString(key), function (err, data) {
		data && res.json(parse(data).data);
	}, thriftRPC_YL.platform);
});

// 根据用户经纬度返回附近商家
router.get('/range', (req, res) => {
	let key = "restaurant_selectByRange";
	ACTIONS_LIST[key].data = {
		offset: 0,
		limit: 10,
		longitude: LONGITUDE,
		latitude: LATITUDE
	};
	thriftRPC_YL.send(toString(key), function (err, data) {
		data && res.json(parse(data).data);
	}, thriftRPC_YL.platform);
});

// 根据商家id查询
router.get('/:id', (req, res) => {
	let key = 'restaurant_getById';
	let data = req.params;
	ACTIONS_LIST[key] ? ACTIONS_LIST[key].data = data : ACTIONS_LIST[key] = {};
	thriftRPC_YL.send(toString(key), function (err, data) {
	    data && res.json(parse(data).data);
	}, thriftRPC_YL.platform);
});

// 查询起送价
router.get('/:id/deliver_amount', (req, res) => {
	let key = 'restaurant_getDeliverAmount';
	let id = req.params.id;
	ACTIONS_LIST[key].data = {
		restaurant_id: id,
		longitude: LONGITUDE,
		latitude: LATITUDE
	};
	thriftRPC_YL.send(toString(key), function (err, data) {
	    data && res.json(parse(data).data);
	}, thriftRPC_YL.platform);
});

// 商家的菜单列表
router.get('/:id/menu', (req, res) => {
	let key = 'foodCategory_selectByRestaurant';
	let data = req.params;
	ACTIONS_LIST[key] ? ACTIONS_LIST[key].data = data : ACTIONS_LIST[key] = {};
	thriftRPC_YL.send(toString(key), function (err, data) {
	    data && res.json(parse(data).data);
	}, thriftRPC_YL.platform);
});

// 查询商家实景图
router.get('/:id/photos', (req, res) => {
	let key = "photos_getByReId";
	let rid = req.params.id;
	ACTIONS_LIST[key].data = { id: rid};
	thriftRPC_YL.send(toString(key), function (err, data) {
		data && res.json(parse(data).data);
	}, thriftRPC_YL.platform);
});

// 商家&食物混合查询
router.get('/query/restaurant_foods', (req, res) => {
	let key = 'restaurant_selectByKeyWord';
	let query = req.query;
	ACTIONS_LIST[key].data = {
		offset: query.offset || 0,
		limit: query.limit || 10,
		longitude: query.longitude || LONGITUDE,
		latitude: query.latitude || LATITUDE,
		keyword: query.keyword || ''
	};
	thriftRPC_YL.send(toString(key), function (err, data) {
	    data && res.json(parse(data).data);
	}, thriftRPC_YL.platform);
});


module.exports = router;
