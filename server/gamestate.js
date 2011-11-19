var sys = require('sys');
var inspect = require('util').inspect;
var CaseFile=require('./casefile');
var CardDeck=require('./carddeck');

GameState = function(){
    this.currentPlayer = "";
    this.status = "";
    this.players = new Array();
    this.notReadyPlayers=0;
    this.readyPlayers=0
    this.totalPlayers=0
    this.pieces = new Array();
    this.turnList = new Array();
    this.turnNumber=0;
    this.currentChoosingPlayer=0;
    this.wholeDeck=new CardDeck();
    this.caseFile=new CaseFile();
};

GameState.prototype.getPieceByName = function(name){
		for (var i=0;i<this.pieces.length;i++){
		if (this.pieces[i].name == name){
			return this.pieces[i];
		}
	}
	return null;
}
GameState.prototype.getAvailablePieces = function(){
	var availablePieces = new Array;
	for(var i=0; i<this.pieces.length;i++){
		if(this.pieces[i].available==true){
			availablePieces[availablePieces.length]=this.pieces[i];
		}
	}
	return availablePieces;
}

GameState.prototype.chosePieces = function(io){
	var availablePieces=this.getAvailablePieces();
	if (io!=''){
		io.sockets.emit('alert',this.players[this.currentChoosingPlayer].name + ' is choosing a game piece now');
		io.sockets.socket(this.players[this.currentChoosingPlayer].sessionID).emit('availablePieces',availablePieces);	
		//io.sockets.socket(this.players[this.currentChoosingPlayer].sessionID).emit('chosePiece','');	
	}
	this.currentChoosingPlayer++;
}


GameState.prototype.setCurrentPlayer = function(io){
		for (var i=0;i<this.players.length;i++){
			if (i==this.turnNumber){
				this.turnList[i].status='currentPlayer';
			}else this.turnList[i].status='notCurrentPlayer';
		}
		io.sockets.emit('startTurn',this.turnList[i]);
		if(this.turnNumber=this.players.length-1){
			this.turnNumber=0;
		}else this.turnNumber++;
}

GameState.prototype.addPiece = function(name, player,GameState){
	var Piece = require('./piece');
	aPiece = new Piece();
	aPiece.initialize(name, player);
	this.pieces[this.pieces.length]=aPiece;
}

GameState.prototype.setupPieces = function(){
	this.addPiece('Miss Scarlet',true);	
	this.addPiece('Colonel Mustard',true);	
	this.addPiece('Mrs. White',true);	
	this.addPiece('Mr. Green',true);	
	this.addPiece('Mrs. Peacock',true);	
	this.addPiece('Professor Plum',true);	
}

GameState.prototype.getPlayerBySessionID = function(sessionID){
	for (var i=0;i<this.players.length;i++){
		if (this.players[i].sessionID == sessionID){
			return this.players[i];
		}
	}
	return null;
}


GameState.prototype.addPlayer = function(player){
	this.players[this.players.length]=player;
}

GameState.prototype.getPlayerByName = function(playerName){
	for (player in this.players){
		if (player.name == playerName){
			return player.sessionID;
		}
	}
	return null;
}

GameState.prototype.orderPlayers = function(){
	for(var i=0;i<this.pieces.length;i++){
		if(this.pieces[i].player!=''){
			this.turnList[i]=this.pieces[i].player;
		}
	}
}

//This function is called to setup all the card decks and create the case file. It also shuffles the decks.
GameState.prototype.setupDecks = function(){
	var CardDeck=require('./carddeck');
	var CaseFile = require('./casefile');

	var weaponsDeck = new CardDeck();
	weaponsDeck=weaponsDeck.initialize('weapons',['candlestick','knife','lead pipe','revolver','rope','wrench']);

	var charactersDeck = new CardDeck();
	charactersDeck.initialize('characters',['Colonel Mustard','Mr. Green','Mrs. Peacock','Miss Scarlet','Mrs. White','Professor Plum']);

	var roomsDeck = new CardDeck();
	roomsDeck.initialize('rooms',['kitchen','ballroom','conservatory','dining room','library','cellar','lounge','hall','study']);

	this.caseFile.initialize(weaponsDeck.cards[0].value,charactersDeck.cards[0].value,roomsDeck.cards[0].value);

	weaponsDeck.cards.splice(0,1);
	charactersDeck.cards.splice(0,1);
	roomsDeck.cards.splice(0,1);
	this.wholeDeck.initialize('whole','');
	this.wholeDeck.cards=weaponsDeck.cards.concat(charactersDeck.cards,roomsDeck.cards);
	this.wholeDeck.shuffle();
}


// This gets called the first time once everybody is ready, currentChoosingPlayer starts at 0, the first player to join
// then after this the server waits for the player to choose a piece, once she has done that, this function is called again
// for the next player. This is called until all the players have chosen a piece.

// This function sets the current player from turnNumber which starts at 0. So the turnList array stores the order
// of the players, we walk through that array as the game progresses. 
GameState.prototype.dealAndChoosePieces = function(io){
	this.dealCards(io);
	this.chosePieces(io);
}

//This function deals cards to the players in the players array. Send in the wholeDeck.cards
GameState.prototype.dealCards = function(io){
	var i=0;
	while(i<this.wholeDeck.cards.length){
		for(var j=0;j<this.players.length;j++){
			if (i<this.wholeDeck.cards.length){
				this.players[j].cards[this.players[j].cards.length]=this.wholeDeck.cards[i];
				i++;
			}else break;
		}
	}
	if(io!=''){
		//This loops sends the dealt cards to each player
		for(var j=0;j<this.players.length;j++){
			io.sockets.socket(this.players[j].sessionID).emit('dealtCards', this.players[j].cards);	
		}
	}
		
}

GameState.prototype.startGame = function(){
	this.orderPlayers();
	this.setCurrentPlayer(io);
	this.status='playing';
}

GameState.prototype.getFirstDisprovingPlayer = function(suggestion){
	var cards='';
	var i=0;
	for(var i=0;i<this.pieces.length;i++){
		if(this.pieces[i].player.name != undefined){
			cards = this.getDisprovingCards(this.pieces[i].player.cards,suggestion);
			if(cards != ''){
				return ({player:this.pieces[i].player, cards:cards});
			}
		}
	}
	return '';
}

GameState.prototype.getDisprovingCards = function(cards,suggestion){
	var disprovingCards = new Array;
	for(var i=0;i<cards.length;i++){
		if(cards[i].value===suggestion.weapon||cards[i].value===suggestion.room||cards[i].value===suggestion.character){
			disprovingCards[disprovingCards.length]=cards[i];
		}
	}
	return disprovingCards;
}

GameState.prototype.checkAccusation = function(accusation){
	if(this.caseFile.weaponCard===accusation.weapon && this.caseFile.characterCard===accusation.character &&
	 this.caseFile.roomCard===accusation.room){
	 	return true;
	 }else return false;
}


module.exports = GameState;
