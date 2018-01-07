const express = require('express');
const server = express();

// epxress plugin
const bodyParser = require('body-parser');
const multer = require('multer');
let upload = multer();	// for parsing multipart/form-data

// 路由模块
const routers = require('./router/index');

// for parsing application/json
server.use(bodyParser.json());
// for parsing application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: true }));


// Server 设置
const HOST_NAME = process.env.HOST_NAME || '127.0.0.1';
const PORT = process.env.PORT || 3000;
let server_info = [
	'Express Server listen on -> http://',
	HOST_NAME + '/' + PORT,
	'\r\n',
	'terminate server - click "Ctrl and C" twice if you want'
].join('');


// 跨域设置 allow custom header and CORS
server.all('*',function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
  res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');

  if (req.method == 'OPTIONS') {
    res.sendStatus(200); /*让options请求快速返回*/
  }
  else {
    next();
  }
});


// Example router
const thriftRPC = require('./rpcClient');
server.post('/test', (req, res) => {
	let data = req.body;
	res.send(data);
	// console.dir(thriftRPC);
	// thriftRPC.send('hello', (err, data) => {
	// 	data = data;
	// 	console.log('error:' + err);
 //    console.log('data:' + data);
	// 	data && res.send(data);
	// });
});

routers.forEach((el, index) => server.use(el.path, el.component));

// Server Listen
server.listen(PORT, HOST_NAME,() => console.log(server_info));
