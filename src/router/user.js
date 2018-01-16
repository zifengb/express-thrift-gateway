const express = require('express');
const router = express.Router();

const INIT_RPC = {
	token: "asdjkasl5465asd4as5",
	time: 10000
};

const ACTIONS_LIST = {
	"USER_UPDATE": {
        // 注册
		action: "USER_UPDATE"
    },
    "USER_QUERY": {
        // 更新用户信息
        action: "USER_QUERY"
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

// 注册
router.post('/register', (req, res) => {
	let query = req.body;
	isRegistered(query).then((flag) => {
		if (flag) {
			res.json({
				state: 0,
				msg: '已经被注册了'
			});
		} else {
			let key = 'USER_UPDATE';
			ACTIONS_LIST[key].data = {
				userName: query.userName,
				loginPassword: query.loginPassword
			}
			thriftRPC_JX.send(toString(key), function (err, data) {
				res.json({
					state: 1,
					msg: '注册成功'
				});
			}, thriftRPC_JX.platform);
		}
	}).catch((err) => {
		console.log(err)
	});
});

router.post('/login', (req, res) => {
	let query = req.body;
	isRegistered(query).then((flag) => {
		if (flag) {
			let key = 'USER_QUERY';
			ACTIONS_LIST[key].data = {
				userName: query.userName,
				loginPassword: query.loginPassword
			}
			thriftRPC_JX.send(toString(key), function (err, data) {
				let result = parse(data).data
				result.list[0].addressText = parse(result.list[0].addressText);
				if (result.list.length > 0) {
					res.json({
						state: 1,
						msg: '登录成功',
						result: result
					})
				} else {
					res.json({
						state: 0,
						msg: '登录失败,密码错误',
					})
				}
			}, thriftRPC_JX.platform)
		} else {
			res.json({
				state: 0,
				msg: '账号未被注册'
			});
		}
	})

});

router.post('/updateUserName', (req, res) => {
	let query = req.body;
	// 更新用户名
	let key = 'USER_UPDATE';
	ACTIONS_LIST[key].data = {
		userId: query.userId,
		userName: query.userName,
	}
	thriftRPC_JX.send(toString(key), function (err, data) {
		let result = parse(data).data
		// 获取最新的账号信息
		let key = 'USER_QUERY';
		ACTIONS_LIST[key].data = {
			userId: query.userId
		}
		thriftRPC_JX.send(toString(key), function (err, data) {
			let result = parse(data).data
			result.list[0].addressText = parse(result.list[0].addressText);
			res.json({
				state: 1,
				msg: '成功更新用户名',
				result: result
			})
		}, thriftRPC_JX.platform)
	}, thriftRPC_JX.platform);
});

router.post('/updateLoginPassword', (req, res) => {
	let query = req.body;
	// 更新用户登录密码
	let key = 'USER_UPDATE';
	ACTIONS_LIST[key].data = {
		userId: query.userId,
		loginPassword: stringify(query.loginPassword)
	}
	thriftRPC_JX.send(toString(key), function (err, data) {
		let result = parse(data).data
		// 获取最新的账号信息
		let key = 'USER_QUERY';
		ACTIONS_LIST[key].data = {
			userId: query.userId
		}
		thriftRPC_JX.send(toString(key), function (err, data) {
			let result = parse(data).data
			result.list[0].addressText = parse(result.list[0].addressText);
			res.json({
				state: 1,
				msg: '成功重置登录密码',
				result: result
			})
		}, thriftRPC_JX.platform)
	}, thriftRPC_JX.platform);
});

router.post('/updatePayPassword', (req, res) => {
	let query = req.body;
	// 更新用户支付密码
	let key = 'USER_UPDATE';
	ACTIONS_LIST[key].data = {
		userId: query.userId,
		payPassword: query.payPassword
	}
	thriftRPC_JX.send(toString(key), function (err, data) {
		let result = parse(data).data
		// 获取最新的账号信息
		let key = 'USER_QUERY';
		ACTIONS_LIST[key].data = {
			userId: query.userId
		}
		thriftRPC_JX.send(toString(key), function (err, data) {
			let result = parse(data).data
			result.list[0].addressText = parse(result.list[0].addressText);
			res.json({
				state: 1,
				msg: '成功重置支付密码',
				result: result
			})
		}, thriftRPC_JX.platform)
	}, thriftRPC_JX.platform);
});

router.post('/updateAddressText', (req, res) => {
	let query = req.body;
	let key = 'USER_QUERY';
	ACTIONS_LIST[key].data = {
		userId: query.userId
	}
	thriftRPC_JX.send(toString(key), function (err, data) {
		let addressText = [];
		if (parse(data).data.addressText) {
			addressText = parse(parse(data).data.addressText)
			query.addressText.id = addressText.length
			for (var i = 0; i < addressText.length; i++) {
				addressText[i].isDefault = false;
			}
			query.addressText.isDefault = true
			addressText.push(query.addressText)
		} else {
			query.addressText.id = 0
			query.addressText.isDefault = true
			addressText.push(query.addressText)
		}
		let key = 'USER_UPDATE';
		// console.log(stringify(addressText))
		ACTIONS_LIST[key].data = {
			userId: query.userId,
			addressText: stringify(addressText)
		}
		thriftRPC_JX.send(toString(key), function (err, data) {
			res.json({
				state: 1,
				msg: '成功添加地址',
				result: addressText
			})
		}, thriftRPC_JX.platform)
	}, thriftRPC_JX.platform)
});

function isRegistered(query) {
	return new Promise((resolve, reject) => {
		let key = 'USER_QUERY';
		ACTIONS_LIST[key].data = {
			userName: query.userName,
		}
		thriftRPC_JX.send(toString(key), function (err, data) {
			let res = parse(data).data
			if (res.count === 1) {
				resolve(true)
			} else {
				resolve(false)
			}
		}, thriftRPC_JX.platform)
	})
}
module.exports = router;
