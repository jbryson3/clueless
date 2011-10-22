var sys = require("sys");
var players = [];

exports.io = function(server){
	server.listen(80);	
	io = require('socket.io').listen(server);
	io.set('log level', 1);
	return io;
}

putsMessage=function(message){
	sys.puts("Received Message: '"+ message[0] + "' Data: [" + message[1] + "]" );
}

exports.setupsocketserver = function(io){
exports.socketserver=io.sockets.on('connection', function(socket) {
	socket.on('clientPlayerJoinGame', function(player) {
		putsMessage(['clientPlayerJoinGame', player]);
		io.sockets.emit('bdcstPlayerJoinedGame', player)
	});
	socket.on('clientPlayerPlayerReady', function(message) {
		putsMessage(['clientPlayerPlayerReady', message]);
	});
	socket.on('clientPlayerChoseGamePiece', function(message) {
		putsMessage(['clientPlayerChoseGamePiece', message]);
	});
	socket.on('clientPlayerLocationChosen', function(message) {
		putsMessage(['clientPlayerLocationChosen', message]);
	});
	socket.on('clientPlayerSuggestion', function(message) {
		putsMessage(['clientPlayerSuggestion', message]);
	});
	socket.on('clientPlayerDisproveSuggestion', function(message) {
		putsMessage(['clientPlayerDisproveSuggestion', message]);
	});
	socket.on('clientPlayerAccusation', function(message) {
		putsMessage(['clientPlayerAccusation', message]);
	});
	socket.on('clientChatMessage', function(message) {
		putsMessage(['clientChatMessage', message]);
	});
});
return exports.socketserver;
};