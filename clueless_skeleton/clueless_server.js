http=require('http');
assert=require('assert');
server=require('./clueless_http_server.js');

clueless_server = require('./clueless_socket_server.js');
io=clueless_server.io(server);
socketserver=clueless_server.setupsocketserver(io);

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

