var sys = require("sys");
var inspect = require('util').inspect;

//Controls whether debug messages from this object get printed or not

var GameState = require('./gamestate');
var gameState = new GameState();
gameState.setupPieces();

gameState.setupDecks();

gameState.caseFile.printFile();
gameState.wholeDeck.printDeck();

exports.io = function(server,port){
	server.listen(port);	
	io = require('socket.io').listen(server);
	io.set('log level', 3);
	return io;
}

function printDebug(message){
		sys.puts(message);
}

function putsMessage(message){
	sys.puts("Received Message: '"+ message[0] + "' Data: [" + message[1] + "]" );
}

exports.setupsocketserver = function(io){
exports.socketserver=io.sockets.on('connection', function(socket) {
	
	socket.on('playerJoinGame', function(name) {
		var Player = require('./player');
		//Should this function check for 6 players or does the client?
		putsMessage(['clientPlayerJoinGame', name]); //Prints message to console
		//This function shall add the new player to the global players array
		aPlayer = new Player();
		aPlayer.initialize(name,socket.id);
		gameState.notReadyPlayers+=1;
		gameState.totalPlayers+=1;
		gameState.addPlayer(aPlayer);
		io.sockets.emit('playerJoinedGame', aPlayer.name);
		//io.sockets.socket(socket.id).emit('availablePieces', gameState.pieces);
		printDebug("Numer of Players: "+ gameState.notReadyPlayers);
		printDebug(inspect(gameState.players));
	});
	socket.on('playerReady', function(message) {
		var player = gameState.getPlayerBySessionID(socket.id);
		io.sockets.emit('playerIsReady', player.name);
		putsMessage(['playerReady', player.name]); //Prints message to console
		gameState.readyPlayers++;
		gameState.notReadyPlayers--;
		if(gameState.readyPlayers==gameState.readyPlayers && gameState.readyPlayers>=3){
			gameState.dealAndChoosePieces(io);
		}
		//The function shall broadcast to other players that the particular player is ready
		//The function shall set the player's status to ready in the object that is storing the player's status
		//The function shall check to see if all the current players are ready
		//If all the players are ready, the function shall randomly select one card from each of the three card stacks and store the results in the case file
		//If all the players are ready, the function shall randomly issue the remaining cards to the players. It will send a message to them with their cards
	});
	socket.on('playerChoseGamePiece', function(message) {
		thePlayer = gameState.getPlayerBySessionID(socket.id);
		thePiece = gameState.getPieceByName(message);
		thePlayer.piece=thePiece;
		thePiece.player=thePlayer;
		thePiece.available = false;
		theMessage = thePlayer.name + ' chose ' + message;
		io.sockets.emit('aPlayerChoseGamePiece', theMessage); //Prints message to console
		
		/*
		So to get this working for players to choose pieces, we first kick this off above in the startGame function
		then that calls the chosePieces function where var currentChoosingPlayer is set to 0, after they are sent
		a message to chose a piece, that var is incremented. Then the server sits and waits for the player to chose a piece,
		once they have choosen, then this function is called, the piece gets stored and removed from the available list
		then we call the next player until all players have choosen.		
		*/
		if (currentChoosingPlayer<gameState.players.length){
			chosePieces(io);
		}else startGame();
		//The function shall broadcast to the other players that the particular player choose a game piece
		//The function shall set the player's game piece in the object that is storing the player's status
	});
	socket.on('playerLocationChosen', function(message) {
		putsMessage(['aPlayerLocationChosen', message]); //Prints message to console
		//The function shall broadcast to the other players that the particular player has moved to a location
		//The function shall set the player's location in the object that is storing the player's status
	});
	socket.on('playerSuggestion', function(message) {
		putsMessage(['playerSuggestion', message]); //Prints message to console
		//The function shall broadcast to the other players that the particular player has made a suggestion
		//The function shall store the player's suggestion data
	});
	socket.on('playerDisproveSuggestion', function(message) {
		putsMessage(['playerDisproveSuggestion', message]); //Prints message to console
		//The function shall broadcast to the other players that the particular player has shared a card with the suggesting player
		//The function shall send a message to the suggesting player with the shared card data
	});
	socket.on('playerAccusation', function(message) {
		putsMessage(['playerMadeAccusation', message]); //Prints message to console
		//The function shall broadcast to the other players that the particular player has made a accusation
		//The function shall store the player's accusation data
		//The function shall check the player's accusation data against the case file
		//If the accusation is correct, the function shall broadcast a winner message to all the players and end the game
		//If the accusation is false, the function shall broadcast a bad accusation message and inactivate the accusing player
	});
	socket.on('playerChatMessage', function(message) {
		putsMessage(['chatMessage', message]); //Prints message to console
		//The function shall broadcast the chat message to all the players and spectators
	});

	
});
return exports.socketserver;
};