var util = require("util");
var inspect = require('util').inspect;
var repl=require('repl');

//Controls whether debug messages from this object get printed or not

var GameState = require('./gamestate');
var gameState = new GameState();

var local=repl.start("cluelesssrv:>");
local.context.srv=gameState;

gameState.setupPieces();

gameState.setupDecks();

gameState.caseFile.printFile();
gameState.wholeDeck.printDeck();

exports.io = function(server,port){
	server.listen(port);	
	io = require('socket.io').listen(server);
	io.set('log level', 1);
	return io;
}

function printDebug(message){
		util.puts(message);
}

function putsMessage(message){
	util.puts("Received Message: '"+ message[0] + "' Data: [" + message[1] + "]" );
}

exports.setupsocketserver = function(io){


	exports.socketserver=io.sockets.on('connection', function(socket) {
		
		socket.on('disconnect',function(){
			//printDebug(inspect(socket));
			var person = gameState.getPlayerBySessionID(socket.id);
			if(person){
				
				if(person.type == 'player' && gameState.status == 'playing'){
					// A player left during the game. End the game and reset.
					gameState.reset();
					io.sockets.emit('prematureEndGame');
				}
				
				gameState.removePlayerBySessionID(socket.id);
				printDebug("Player disconnected and removed: "+ person.name);
				io.sockets.emit('playerLeftGame', person, gameState.readyPlayers, gameState.totalPlayers);
			}
		});
		socket.on('getPlayers', function(fn) {
			fn(gameState);
		});
		socket.on('playerJoinGame', function(name) {
			var Player = require('./player');
			//Should this function check for 6 players or does the client?
			putsMessage(['playerJoinedGame', name]); //Prints message to console
			//This function shall add the new player to the global players array
			aPlayer = new Player();
			aPlayer.initialize(name,socket.id,'player');
			gameState.notReadyPlayers+=1;
			gameState.totalPlayers+=1;
			gameState.addPlayer(aPlayer);
			io.sockets.emit('playerJoinedGame', aPlayer);
			//io.sockets.socket(socket.id).emit('availablePieces', gameState.pieces);
			//printDebug(inspect(gameState.players));
		});
		socket.on('spectatorJoinGame', function(name) {
			var Player = require('./player');
			//var Spectator = require('./spectator');
			//Should this function check for 6 players or does the client?
			putsMessage(['spectatorJoinedGame', name]); //Prints message to console
			//This function shall add the new player to the global players array
			aSpectator = new Player();
			aSpectator.initialize(name,socket.id,'spectator');
			gameState.addPlayer(aSpectator);
			io.sockets.emit('playerJoinedGame', aSpectator);
			//io.sockets.socket(socket.id).emit('availablePieces', gameState.pieces);
		});

		socket.on('checkName', function(name, fn){
			//io.sockets.sockets[socket.id].emit('checkedName',gameState.checkName(name));
			fn(gameState.checkName(name));
		});

		socket.on('getGameStatus', function(name){
			io.sockets.sockets[socket.id].emit('gameStatus',gameState.status);
		});

		socket.on('getAllPlayers', function(){
			io.sockets.sockets[socket.id].emit('allPlayers',gameState.players);
			io.sockets.sockets[socket.id].emit('allSpectator',gameState.spectators);
		});

		socket.on('playerReady', function() {
			var player = gameState.getPlayerBySessionID(socket.id);
			io.sockets.emit('playerIsReady', player.name);
			putsMessage(['playerReady', player.name]); //Prints message to console
			player.ready = true;
			gameState.readyPlayers++;
			gameState.notReadyPlayers--;
			if(gameState.readyPlayers==gameState.totalPlayers && gameState.readyPlayers>=3){
				putsMessage(['Gamestart', 'Game is started!']);
				gameState.status='playing';
				io.sockets.emit('alert', 'All players are ready. Wait for players to choose pieces.');
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
			//has player already picked?
			if(thePlayer.piece == ''){
				thePiece = gameState.getPieceByName(message);

				thePlayer.piece=thePiece;
				thePiece.playerName=thePlayer.name;
				thePiece.available = false;
				theMessage = thePlayer.name + ' chose ' + message;
				io.sockets.emit('alert', theMessage); //Prints message to console
				
				/*
				So to get this working for players to choose pieces, we first kick this off above in the startGame function
				then that calls the chosePieces function where var currentChoosingPlayer is set to 0, after they are sent
				a message to chose a piece, that var is incremented. Then the server sits and waits for the player to chose a piece,
				once they have choosen, then this function is called, the piece gets stored and removed from the available list
				then we call the next player until all players have choosen.		
				*/
				if (gameState.currentChoosingPlayer<gameState.playersInGame.length){
					gameState.chosePieces(io);
				}else gameState.startGame();
			}
			//The function shall broadcast to the other players that the particular player choose a game piece
			//The function shall set the player's game piece in the object that is storing the player's status
		});

		socket.on('playerLocationChosen', function(locationName) {
			if(gameState.getPlayerBySessionID(socket.id).status == 'currentPlayer'){
				var locationCheck = gameState.checkLocation(socket.id,locationName);
				var player=gameState.getPlayerBySessionID(socket.id);
				if (locationCheck===true){
					gameState.setPlayerLocation(player,locationName);
					io.sockets.emit('aPlayerLocationChosen',player);
				}else io.sockets.sockets[socket.id].emit('badLocation','');
				putsMessage(['aPlayerLocationChosen', player.piece.name +" moved to "+ locationName]); //Prints message to console
			}
			//The function shall broadcast to the other players that the particular player has moved to a location
			//The function shall set the player's location in the object that is storing the player's status
		});

		socket.on('playerSuggestion', function(suggestion) {
			var player = gameState.getPlayerBySessionID(socket.id);
			io.sockets.emit('alert',player.name + " has made a suggestion. \"It was "+ suggestion.character + " with the " + suggestion.weapon + " in the " + suggestion.room + ".\"");
			putsMessage(['playerSuggestion', inspect(suggestion)]); //Prints message to console
			
			//if piece is being played, move player to suggested room
			if(!gameState.getPieceByName(suggestion.character).available){
				gameState.setPlayerLocation(gameState.getPlayerByName(gameState.getPieceByName(suggestion.character).playerName), suggestion.room);
			}
			io.sockets.emit('playerWasMoved',suggestion);
			
			var dpInfo = gameState.getFirstDisprovingPlayer(player, suggestion);
			if(dpInfo != ''){
				util.puts('sending disproveSuggestion: ' + inspect(dpInfo));
				io.sockets.sockets[dpInfo.player.sessionID].emit('disproveSuggestion',dpInfo.cards)
			}else{
				io.sockets.emit('alert', 'No one is able to disprove ' + player.name + "'s suggestion.");
			};
			//The function shall broadcast to the other players that the particular player has made a suggestion
			//The function shall store the player's suggestion data
		});

		socket.on('playerDisprovedSuggestion', function(disprovingData) {
			var player = gameState.getPlayerBySessionID(socket.id);
			putsMessage(['PlayerDisprovedSuggestion', disprovingData]); //Prints message to console
			io.sockets.emit('alert',player.name + " has disproved the suggestion.");
			var sessionID = gameState.getCurrentPlayer().sessionID;
			io.sockets.sockets[sessionID].emit('suggestionDisproved',player,disprovingData)
			//The function shall broadcast to the other players that the particular player has shared a card with the suggesting player
			//The function shall send a message to the suggesting player with the shared card data
		});

		socket.on('playerAccusation', function(accusation) {
			var player = gameState.getPlayerBySessionID(socket.id);
			io.sockets.emit('alert', player.name + ' has made an accusation! It was ' + accusation.character + ' with the ' + accusation.weapon + ' in the ' + accusation.room + "!");
			putsMessage(['playerMadeAccusation', inspect(accusation)]); //Prints message to console
			if(gameState.checkAccusation(accusation)){
				io.sockets.emit('playerWonByAccusation',player);
				gameState.reset();
			}else{
				//suspend player
				player.status = 'suspended';
				io.sockets.emit('playerSuspended',player);
				
				//check to see if there are at least 2 non-suspended players
				var nonsuspended = new Array();
				for(var i = 0; i<gameState.turnList.length; i++){
					if(gameState.turnList[i].status != 'suspended'){
						nonsuspended.push(gameState.turnList[i]);
					}
				}
				if(nonsuspended.length < 2){
					io.sockets.emit('playerWonByDefault', nonsuspended[0]);
					io.sockets.emit('alert', 'The answer was: ' + gameState.caseFile.characterCard + " did it with the " +gameState.caseFile.weaponCard + " in the " +gameState.caseFile.roomCard +".")
					gameState.reset();
				}else{
					gameState.nextTurn();
				}
			}
			//The function shall broadcast to the other players that the particular player has made a accusation
			//The function shall store the player's accusation data
			//The function shall check the player's accusation data against the case file
			//If the accusation is correct, the function shall broadcast a winner message to all the players and end the game
			//If the accusation is false, the function shall broadcast a bad accusation message and inactivate the accusing player
		});

		socket.on('playerChatMessage', function(message) {
			//putsMessage(['chatMessage', message]); //Prints message to console
			//io.socket.emit('chatMessage',message);
			//The function shall broadcast the chat message to all the players and spectators
			var player = gameState.getPlayerBySessionID(socket.id);
			socket.broadcast.emit('bdcstChat', message, player);
		});
		
		socket.on('playerEndTurn', function() {
			//The function shall broadcast the chat message to all the players and spectators
			var player = gameState.getPlayerBySessionID(socket.id);
			if(gameState.getCurrentPlayer().name == player.name){
				putsMessage(['playerEndTurn', player.name]); //Prints message to console
				io.sockets.emit('alert', player.name + ' has ended their turn.');
				gameState.nextTurn();
			}else{
				putsMessage(['playerEndTurn that wasnt current player!!!', player.name + ' should have been ' + gameState.getCurrentPlayer().name]); //Prints message to console
			}
		});

		socket.on('playerQuit', function(playerName) {
			putsMessage(['chatMessage', playerName]); //Prints message to console
			io.socket.emit('playerQuit',playerName);
			gameState = new GameState();
			gameState.setupPieces();
			gameState.setupDecks();
			gameState.caseFile.printFile();
			gameState.wholeDeck.printDeck();
			//The function shall broadcast the quit message to all the players and spectators and reset the game
		});
		
	});
	return exports.socketserver;
};