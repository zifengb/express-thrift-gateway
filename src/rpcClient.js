const thrift = require('thrift');
const rpcService = require('./gen-nodejs/IRpcService');
const thriftPool = require('node-thrift-pool');

// test
// const HOST = '127.0.0.1';
// const PORT = 8090

// dev
const PORT = 1027;
const HOST = '10.31.88.105';

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

exports.send = send;

// send("hello", function (err, data) {
//     console.log('error:' + err);
//     console.log('data:' + data);
// });
