var sys = require('sys');
var assert = require("assert-extras");
var inspect=require('util').inspect;
var sys = require('sys');
var Gamestate=require('../gamestate');
var gamestate = new Gamestate();
var Player = require('../player');
var Piece = require('../piece');

gamestate.setupPieces();
assert.equal(gamestate.pieces[0].name,'Miss Scarlet');
assert.equal(gamestate.pieces[1].name,'Colonel Mustard');	
assert.equal(gamestate.pieces[2].name,'Mrs. White');	
assert.equal(gamestate.pieces[3].name,'Mr. Green');	
assert.equal(gamestate.pieces[4].name,'Mrs. Peacock');	
assert.equal(gamestate.pieces[5].name,'Professor Plum');

gamestate.setupDecks();

assert.equal(gamestate.wholeDeck.cards.length,18);
for(var i = 0; i<gamestate.wholeDeck.cards.length; i++){
	assert.isNotUndefined(gamestate.wholeDeck.cards[i]);
}

player1=new Player();
player1.initialize('Al',123)
gamestate.addPlayer(player1); 

player2=new Player();
player2.initialize('Sue',124)
gamestate.addPlayer(player2); 

player3=new Player();
player3.initialize('Kim',125)
gamestate.addPlayer(player3);

assert.equal(gamestate.players.length,3);
assert.equal(gamestate.players[0].name,'Al');
assert.equal(gamestate.players[1].name,'Sue');
assert.equal(gamestate.players[2].name,'Kim');
assert.equal(gamestate.players[0].sessionID,123);
assert.equal(gamestate.players[1].sessionID,124);
assert.equal(gamestate.players[2].sessionID,125);
assert.isNotUndefined(gamestate.getPlayerBySessionID(123));

assert.equal(gamestate.currentChoosingPlayer,0);
gamestate.chosePieces('');
assert.equal(gamestate.currentChoosingPlayer,1);


gamestate.players[0].piece=gamestate.pieces[2];
gamestate.players[1].piece=gamestate.pieces[0];
gamestate.players[2].piece=gamestate.pieces[4];
gamestate.pieces[2].player=gamestate.players[0];
gamestate.pieces[0].player=gamestate.players[1];
gamestate.pieces[4].player=gamestate.players[2];

gamestate.orderPlayers();
assert.equal(gamestate.turnList[0].name,gamestate.players[1].name);

gamestate.dealCards('');
assert.equal(gamestate.players[0].cards.length,6);
assert.equal(gamestate.players[1].cards.length,6);
assert.equal(gamestate.players[2].cards.length,6);

for(var i = 0; i<3;i++){
	for(var j = 0; j<gamestate.players[i].cards.length;j++){
		assert.isNotUndefined(gamestate.players[i].cards[j]);
	}
}

var dpInfo = gamestate.getFirstDisprovingPlayer({weapon:'candlestick',room:'kitchen',character:'Colonel Mustard'});
assert.isNotUndefined(dpInfo);
assert.notEqual(dpInfo.name,'');
assert.notEqual(dpInfo.cards.length,0); 

var trueAccusation={weapon:gamestate.caseFile.weaponCard,character:gamestate.caseFile.characterCard,room:gamestate.caseFile.roomCard};

assert.equal(gamestate.checkAccusation(trueAccusation),true);
