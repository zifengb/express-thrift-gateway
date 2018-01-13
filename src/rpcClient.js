const thrift = require('thrift');
const rpcService = require('./gen-nodejs/IRpcService');
const thriftPool = require('node-thrift-pool');

// test
// const HOST = '127.0.0.1';
// const PORT = 8090

// dev
const PORT = 8090;
const HOST = '10.31.89.95';

var thrift_options = {
    timeout : 30000,
    transport : thrift.TFramedTransport,
    protocol : thrift.TCompactProtocol
    // protocol : thrift.TBinaryProtocol
};
var thrift_client = thriftPool(thrift, rpcService, {host: HOST, port: PORT}, thrift_options);

//发送rpc请求
function send(msg, callback) {
    thrift_client.doService(msg, callback);
}

// exports.send = send;

const thriftPoolsConfig = [
    {
        PORT: 8090,
        HOST:'10.31.89.95',
        PLATFORM: 'jianxi',
        thrift_options : {
            timeout : 30000,
            transport : thrift.TFramedTransport,
            protocol : thrift.TCompactProtocol
        }
    },
    {
        PORT: 8090,
        HOST:'10.31.89.95',
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

function sendData(msg, callback, platform) {
    thriftPools[platform].doService(msg, callback)
}

const thriftRPC = {
    platform: 'jianxi',
    sendData: sendData
}

export default thriftRPC  
