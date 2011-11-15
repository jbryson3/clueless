var sys = require("sys");
var inspect = require('util').inspect;



//Controls whether debug messages from this object get printed or not
var printDebug=true;

var weaponsDeck;
var charactersDeck;
var roomsDeck;
var caseFile;
var wholeDeck;

function Player(name, sessionID){
	this.name=name;
	this.sessionID=sessionID;
}

function Card(type, value){
	this.type=type;
	this.value=value;
}

function CardDeck(type){
	this.type=type;
	this.cards=[]
}

function CaseFile(weaponCard,characterCard,roomCard){
	this.weaponCard=weaponCard;
	this.characterCard=characterCard;
	this.roomCard=roomCard;
}

CaseFile.prototype.printFile=function(){
	sys.puts("Case File");
	sys.puts(this.weaponCard);
	sys.puts(this.characterCard);
	sys.puts(this.roomCard);
	sys.puts(" ");
}

//This uses the Fisher-Yates shuffle algorithm, the inside-out version
CardDeck.prototype.shuffle=function(){
	var newCards = new Array;
	newCards[0]=this.cards[0];
	var i=0
	for(i=1;i<this.cards.length;i++){
		var randomNumber=Math.floor(Math.random()*i);
		newCards[i]=newCards[randomNumber];
		newCards[randomNumber]=this.cards[i];
	}
	this.cards=newCards;
}

CardDeck.prototype.printDeck=function(){
	sys.puts("Cards");
	var i=0
	for(i=0;i<this.cards.length;i++){
		sys.puts(this.cards[i].value);
	}
	sys.puts(" ");

}

//This function sets up an individual deck, do not call directly
function setupDeck(type,items){
	var i=0;
	var deck=new CardDeck(type);
	for(i=0;i<items.length;i++){
		var tempCard=new Card(type,items[i]);
		deck.cards[deck.cards.length]=tempCard;
	}
	deck.shuffle();
	return deck;
}

//This function is called to setup all the card decks and create the case file. It also shuffles the decks.
function setupDecks(){

	weaponsDeck = setupDeck('weapons',['candlestick','knife','lead pipe','revolver','rope','wrench']);
	charactersDeck = setupDeck('characters',['Colonel Mustard','Reverend Green','Mrs. Peacock','Miss Scarlet','Mrs. White','Professor Plum']);
	roomsDeck = setupDeck('rooms',['kitchen','ballroom','conservatory','dining room','library','cellar','lounge','hall','study']);

	caseFile=new CaseFile(weaponsDeck.cards[0].value,charactersDeck.cards[0].value,roomsDeck.cards[0].value);
	weaponsDeck.cards.splice(0,1);
	charactersDeck.cards.splice(0,1);
	roomsDeck.cards.splice(0,1);
	wholeDeck=new CardDeck('whole');
	wholeDeck.cards=weaponsDeck.cards.concat(charactersDeck.cards,roomsDeck.cards);
	wholeDeck.shuffle();

}

function Piece(name, available){
	this.name = name;
	this.player='';
	this.available=available;
}

var getPieceByName = function(name){
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

function setupPieces(){
	addPiece('Mr. Mustard',true);	
	addPiece('Mr. Green',true);	
	addPiece('Mrs. Peacock',true);	
	addPiece('Ms. Scarlet',true);	
	addPiece('Mr. White',true);	
	addPiece('Mr. Plum',true);	
}

gameState = {
	currentPlayer : "",
	status : "",
	players : new Array(),
	notReadyPlayers:0,
	readyPlayers:0,
	totalPlayers:0,
	pieces : new Array(),
	addPlayer : function(player){
		gameState.players[gameState.players.length]=player;
	},
	getPlayerSessionID : function(playerName){
		for (player in gameState.players){
			if (player.name == playerName){
				return player.sessionID;
			}
		}
		return null;
	},
	getPlayerBySessionID : function(sessionID){
		for (var i=0;i<gameState.players.length;i++){
			printDebug(inspect(gameState.players[i]));
			if (gameState.players[i].sessionID == sessionID){
				return gameState.players[i];
			}
		}
		return null;
	}
}

setupPieces();
setupDecks();

caseFile.printFile();
wholeDeck.printDeck();

exports.io = function(server){
	server.listen(80);	
	io = require('socket.io').listen(server);
	io.set('log level', 1);
	return io;
}

printDebug = function(message){
		sys.puts(message);
}

putsMessage=function(message){
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
	socket.on('clientPlayerReady', function(message) {
		putsMessage(['clientPlayerReady', message]); //Prints message to console
		//The function shall broadcast to other players that the particular player is ready
		//The function shall set the player's status to ready in the object that is storing the player's status
		//The function shall check to see if all the current players are ready
		//If all the players are ready, the function shall randomly select one card from each of the three card stacks and store the results in the case file
		//If all the players are ready, the function shall randomly issue the remaining cards to the players. It will send a message to them with their cards
	});
	socket.on('playerChoseGamePiece', function(message) {
		thePlayer = gameState.getPlayerBySessionID(socket.id);
		printDebug(socket.id);
		printDebug(inspect(gameState.players));
		thePiece = getPieceByName(message);
		thePiece.available = false;
		theMessage = thePlayer.name + ' chose ' + message;
		io.sockets.emit('aPlayerChoseGamePiece', theMessage); //Prints message to console
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

	socket.on('getNumberOfPlayers', function() {
		io.sockets.socket(socket.id).emit('totalPlayers',gameState.totalPlayers);
	});
	
	
});
return exports.socketserver;
};