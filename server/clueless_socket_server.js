var sys = require("sys");
var inspect = require('util').inspect;
require('./player.js');
require('./cardsAndDecks.js');

//Controls whether debug messages from this object get printed or not
var printDebug=true;

var currentChoosingPlayer=0;
var turnList=new Array;
var turnNumber=0;



function Piece(name, available){
	this.name = name;
	this.player='';
	this.available=available;
}

function getPieceByName(name){
		for (var i=0;i<gameState.pieces.length;i++){
		printDebug(inspect(gameState.pieces[i]));
		if (gameState.pieces[i].name == name){
			return gameState.pieces[i];
		}
	}
	return null;

}

function addPiece(name, player){
	aPiece = new Piece(name, player);
	gameState.pieces[gameState.pieces.length]=aPiece;
}

gameState.prototype.setupPieces = function(){
	addPiece('Miss Scarlet',true);	
	addPiece('Colonel Mustard',true);	
	addPiece('Mrs. White',true);	
	addPiece('Mr. Green',true);	
	addPiece('Mrs. Peacock',true);	
	addPiece('Professor Plum',true);	
}

gameState = {
	currentPlayer : "",
	status : "",
	players : new Array(),
	notReadyPlayers:0,
	readyPlayers:0,
	totalPlayers:0,
	pieces : new Array(),
}


gameState.prototype.getPlayerBySessionID = function(sessionID){
	for (var i=0;i<gameState.players.length;i++){
		printDebug(inspect(gameState.players[i]));
		if (gameState.players[i].sessionID == sessionID){
			return gameState.players[i];
		}
	}
	return null;
}


gameState.prototype.addPlayer = function(player){
	gameState.players[gameState.players.length]=player;
}

gameState.prototype.getPlayerSessionID = function(playerName){
	for (player in gameState.players){
		if (player.name == playerName){
			return player.sessionID;
		}
	}
	return null;
}

gameState.prototype.orderPlayers = function(){
	for(var i=0;i<gameState.pieces.length;i++){
		if(gameState.pieces[i].player!=''){
			turnList[i]=gameState.pieces[i].player;
		}
	}
}


gameState.setupPieces();
gameState.setupDecks();

caseFile.printFile();
wholeDeck.printDeck();

exports.io = function(server){
	server.listen(80);	
	io = require('socket.io').listen(server);
	io.set('log level', 1);
	return io;
}

// This gets called the first time once everybody is ready, currentChoosingPlayer starts at 0, the first player to join
// then after this the server waits for the player to choose a piece, once she has done that, this function is called again
// for the next player. This is called until all the players have chosen a piece.
function chosePieces(players){
	io.sockets.socket(players[currentChoosingPlayer].sessionID).emit('chosePiece','');	
	currentChoosingPlayer++;
}

// This function sets the current player from turnNumber which starts at 0. So the turnList array stores the order
// of the players, we walk through that array as the game progresses. 
function setCurrentPlayer(){
		for (var i=0;i<gameState.players.length;i++){
			if (i==turnNumber){
				turnList[i].status='currentPlayer';
			}else turnList[i].status='notCurrentPlayer';
		}
		io.sockets.emit('startTurn',turnList[i]);
		if(turnNumber=gameState.players.length-1){
			turnNumber=0;
		}else turnNumber++;
}

function dealAndChoosePieces(){
	dealCards(gameState.players, wholeDeck);
	chosePieces(gameState.players);
}


function startGame(){
	orderPlayers();
	setCurrentPlayer();
	gameState.status='playing';
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
		//Should this function check for 6 players or does the client?
		putsMessage(['clientPlayerJoinGame', name]); //Prints message to console
		//This function shall add the new player to the global players array
		aPlayer = new Player(name,socket.id);
		gameState.notReadyPlayers+=1;
		gameState.totalPlayers+=1;
		gameState.addPlayer(aPlayer);
		io.sockets.emit('playerJoinedGame', aPlayer.name);
		io.sockets.socket(socket.id).emit('availablePieces', gameState.pieces);
		printDebug("Numer of Players: "+ gameState.notReadyPlayers);
		printDebug(inspect(gameState.players));
	});
	socket.on('playerReady', function(playerSessionID) {
		var player = gameState.players.getPlayerSessionID(playerSessionID);
		io.sockets.emit('playerIsReady', player.name);
		putsMessage(['playerReady', player.name]); //Prints message to console
		gameState.readyPlayers++;
		gameState.notReadyPlayers--;
		if(gameState.readyPlayers==gameState.readyPlayers){
			dealAndChoosePieces();
		}
		//The function shall broadcast to other players that the particular player is ready
		//The function shall set the player's status to ready in the object that is storing the player's status
		//The function shall check to see if all the current players are ready
		//If all the players are ready, the function shall randomly select one card from each of the three card stacks and store the results in the case file
		//If all the players are ready, the function shall randomly issue the remaining cards to the players. It will send a message to them with their cards
	});
	socket.on('playerChoseGamePiece', function(message) {
		thePlayer = gameState.getPlayerBySessionID(socket.id);
		thePiece = getPieceByName(message);
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
			chosePieces(gameState.players);
		}else startGame();
		//The function shall broadcast to the other players that the particular player choose a game piece
		//The function shall set the player's game piece in the object that is storing the player's status
	});
	socket.on('playerLocationChosen', function(message) {
		putsMessage(['playerLocationChosen', message]); //Prints message to console
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
		putsMessage(['playerAccusation', message]); //Prints message to console
		//The function shall broadcast to the other players that the particular player has made a accusation
		//The function shall store the player's accusation data
		//The function shall check the player's accusation data against the case file
		//If the accusation is correct, the function shall broadcast a winner message to all the players and end the game
		//If the accusation is false, the function shall broadcast a bad accusation message and inactivate the accusing player
	});
	socket.on('chatMessage', function(message) {
		putsMessage(['chatMessage', message]); //Prints message to console
		//The function shall broadcast the chat message to all the players and spectators
	});

	
});
return exports.socketserver;
};