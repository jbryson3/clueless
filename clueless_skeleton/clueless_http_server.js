//var debug = require('util').debug
var sys = require("sys"),
inspect = require('util').inspect,
test = require("assert"),
url = require('url'),
fs = require('fs'),
http = require('http');

server = http.createServer(function(req, res) {
	var request = url.parse(req.url, true);
	sys.puts(request.pathname);
	var action = request.pathname;	
	if (/\.jpeg$/.test(action)) {
		fs.readFile("" + __dirname + action, "binary", function(err, file){
			if(err){
				sys.puts(err);
			}
			else{
				res.writeHead(200, {
					'Content-Type': 'text/jpg'
				});
				res.write(file,"binary")
				res.end();
				return;
			}
		});
	}else{
		if (/\.js$/.test(action)) {
			fs.readFile("" + __dirname + action, "text", function(err, file){
				if(err){
					sys.puts(err);
				}
				else{
					res.writeHead(200, {
						'Content-Type': 'text/javascript'
					});
					res.write(file,"utf8")
					res.end();
					return;
				}
			});
	

	}else{
		if (/\.html$/.test(action)) {
			fs.readFile("" + __dirname + action, function(err, data) {
				res.writeHead(200, {
					'Content-Type': 'text/html'
				});
				return res.end(data, 'utf8');
			});
	}else{
		return fs.readFile("" + __dirname + "/index.html", function(err, data) {
			res.writeHead(200, {
				'Content-Type': 'text/html'
			});
			return res.end(data, 'utf8');
			});
	}
	}
	}
});

module.exports = server;