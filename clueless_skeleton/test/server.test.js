var server=require('../clueless_http_server.js')
	, http=require('http')
	, clueless_server = require('../clueless_socket_server.js')
	, sio = require('socket.io')
	, io=clueless_server.io(server)
	, socketserver=clueless_server.setupsocketserver(io)
	, ports = 80
	, sys=require('sys')
	, util=require('util')
	, should=require('should')
	, assert=require('assert')
;

function HTTPClient (port) {
  this.port = port;
  this.agent = new http.Agent({
      host: 'localhost'
    , port: port
  });
};

HTTPClient.prototype.request = function (path, opts, fn) {
  if ('function' == typeof opts) {
    fn = opts;
    opts = {};
  }

  opts = opts || {};
  opts.agent = this.agent;
  opts.host = 'localhost';
  opts.port = this.port;

  opts.headers = opts.headers || {};
  opts.headers.Host = 'localhost';
  opts.headers.Connection = 'keep-alive';

  var req = http.request(opts, function (res) {
    if (false === opts.buffer)
      return fn && fn(res.data);

    var buf = '';

    res.on('data', function (chunk) {
      buf += chunk;
    });

    res.on('end', function () {
      fn && fn(res, opts.parse ? opts.parse(buf) : buf);
    });
  });
  
  req.on('error', function (err) { });

  if (undefined !== opts.data)
    req.write(opts.data);

  req.end();

  return req;
};


HTTPClient.prototype.get = function (path, fn) {
  if ('function' == typeof opts) {
    fn = opts;
    opts = {};
  }

  var opts={};
  opts.method = 'GET';

  // override the parser for transport requests
  if (/\/(xhr-polling|htmlfile|jsonp-polling)\//.test(path)) {
    // parser that might be necessary for transport-specific framing
    var transportParse = opts.parse;
    opts.parse = function (data) {
    	sys.puts("Parse called");
      if (data === '') return data;

      data = transportParse ? transportParse(data) : data;
      return parser.decodePayload(data);
    };
  } else {
    opts.parse = undefined;
  }

  return this.request(path, opts, fn);

};

client = function (port) {
  return new HTTPClient(port);
};

// HTTPClient.prototype.end = function () {
//   this.agent.sockets.forEach(function (socket) {
//     socket.end();
//   });
// };

// create = function (cl) {
//   var manager = io.listen(cl.port);
//   manager.set('client store expiration', 0);
//   return manager;
// };

    
var cl = client(80);
//io.server.should.be.an.instanceof(http.Server);

cl.get('/', function (res, data) {
	sys.puts(res.statusCode);
    assert.equal(200,res.statusCode);
  //data.should.eql('Welcome to socket.io.');

  // cl.end();
  io.server.close();
});

