const thrift = require('thrift');
const rpcService = require('./gen-nodejs/IRpcService');
const thriftPool = require('node-thrift-pool');

const thriftPoolsConfig = [
    {
        PORT: 8090,
        HOST:'10.31.88.79',
        PLATFORM: 'jianxi',
        thrift_options : {
            timeout : 30000,
            transport : thrift.TFramedTransport,
            protocol : thrift.TCompactProtocol
        }
    },
    {
        PORT: 1027,
        HOST:'10.31.88.206',
        PLATFORM: 'yingli',
        thrift_options : {
            timeout : 30000,
            transport : thrift.TFramedTransport,
            protocol : thrift.TCompactProtocol
        }
    }
]

class ThriftPool{
    constructor(thriftPoolsConfig){
        this.thriftPools = {}
        this.thriftPoolsConfig = thriftPoolsConfig
    }
    createThriftPools(){
        for (let i = 0; i < this.thriftPoolsConfig.length; i++) {
            this.thriftPools[this.thriftPoolsConfig[i].PLATFORM] = thriftPool(thrift, rpcService, {host: thriftPoolsConfig[i].HOST, port: thriftPoolsConfig[i].PORT}, thriftPoolsConfig[i].thrift_options)
        }
        return this.thriftPools
    }
}

const thriftPools = new ThriftPool(thriftPoolsConfig).createThriftPools()

function send(msg, callback, platform) {
    thriftPools[platform].doService(msg, callback)
}

module.exports = {
	thriftRPC_JX: {
		platform: 'jianxi',
		send: send
	},
	thriftRPC_YL: {
		platform: 'yingli',
		send: send
	}
}
