exports.http=require('http');
assert=require('assert');
exports.server=require('./clueless_http_server.js');

exports.clueless_server = require('./clueless_socket_server.js');
exports.io=exports.clueless_server.io(server);
exports.socketserver=exports.clueless_server.setupsocketserver(io);

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

