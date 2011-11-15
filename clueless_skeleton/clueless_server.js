var http=require('http');
var assert=require('assert');
var server=require('./clueless_http_server.js');

var clueless_server = require('./clueless_socket_server.js');
var io=clueless_server.io(server);
var socketserver=clueless_server.setupsocketserver(io);


// cl.get('/',function(res, data){
// 	callbackFired = true;
//     assert.equal('200', res.statusCode);
//  });
// var request = cl.request('GET','/',{'host':'localhost'});
// request.end()
// request.on('response', function (response){
// 	callbackFired = true;
//     assert.equal('200', response.statusCode);
//  });

