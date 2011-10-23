var sys = require("sys");
var inspect = require('util').inspect;

function Player(name){
	this.name=name;
}

gameState = {
	currentPlayer : "",
	status : "",
	players : new Array(),
	notReadyPlayers:0,
	readyPlayers:0,
	totalPlayers:0,
	addPlayer : function(player){
		gameState.players[gameState.players.length]=player;
	}
}

caseFile = {
	weapon:"",
	suspect:"",
	room:""
}

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
	socket.on('clientPlayerJoinGame', function(name) {
		//Should this function check for 6 players or does the client?
		putsMessage(['clientPlayerJoinGame', name]); //Prints message to console
		//This function shall add the new player to the global players array
		aPlayer = new Player(name);
		gameState.notReadyPlayers+=1;
		gameState.totalPlayers+=1;
		gameState.addPlayer(aPlayer);
		io.sockets.emit('bdcstPlayerJoinedGame', aPlayer.name)
		sys.puts(gameState.notReadyPlayers);
	});
	socket.on('clientPlayerReady', function(message) {
		putsMessage(['clientPlayerReady', message]); //Prints message to console
		//The function shall broadcast to other players that the particular player is ready
		//The function shall set the player's status to ready in the object that is storing the player's status
		//The function shall check to see if all the current players are ready
		//If all the players are ready, the function shall randomly select one card from each of the three card stacks and store the results in the case file
		//If all the players are ready, the function shall randomly issue the remaining cards to the players. It will send a message to them with their cards
	});
	socket.on('clientPlayerChoseGamePiece', function(message) {
		putsMessage(['clientPlayerChoseGamePiece', message]); //Prints message to console
		//The function shall broadcast to the other players that the particular player choose a game piece
		//The function shall set the player's game piece in the object that is storing the player's status
	});
	socket.on('clientPlayerLocationChosen', function(message) {
		putsMessage(['clientPlayerLocationChosen', message]); //Prints message to console
		//The function shall broadcast to the other players that the particular player has moved to a location
		//The function shall set the player's location in the object that is storing the player's status
	});
	socket.on('clientPlayerSuggestion', function(message) {
		putsMessage(['clientPlayerSuggestion', message]); //Prints message to console
		//The function shall broadcast to the other players that the particular player has made a suggestion
		//The function shall store the player's suggestion data
	});
	socket.on('clientPlayerDisproveSuggestion', function(message) {
		putsMessage(['clientPlayerDisproveSuggestion', message]); //Prints message to console
		//The function shall broadcast to the other players that the particular player has shared a card with the suggesting player
		//The function shall send a message to the suggesting player with the shared card data
	});
	socket.on('clientPlayerAccusation', function(message) {
		putsMessage(['clientPlayerAccusation', message]); //Prints message to console
		//The function shall broadcast to the other players that the particular player has made a accusation
		//The function shall store the player's accusation data
		//The function shall check the player's accusation data against the case file
		//If the accusation is correct, the function shall broadcast a winner message to all the players and end the game
		//If the accusation is false, the function shall broadcast a bad accusation message and inactivate the accusing player
	});
	socket.on('clientChatMessage', function(message) {
		putsMessage(['clientChatMessage', message]); //Prints message to console
		//The function shall broadcast the chat message to all the players and spectators
	});
});
return exports.socketserver;
};