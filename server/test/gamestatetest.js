var util = require('util');
var assert = require("assert-extras");
var inspect=require('util').inspect;
var Gamestate=require('../gamestate');
var gamestate = new Gamestate();
var Player = require('../player');
var Piece = require('../piece');
var tempAdjRooms='';
var Spectator = require('../spectator');

util.puts("Running gamestate.js unit tests");

gamestate.setupPieces();
assert.equal(gamestate.pieces[0].name,'Miss Scarlet');
assert.equal(gamestate.pieces[1].name,'Colonel Mustard');	
assert.equal(gamestate.pieces[2].name,'Mrs. White');	
assert.equal(gamestate.pieces[3].name,'Mr. Green');	
assert.equal(gamestate.pieces[4].name,'Mrs. Peacock');	
assert.equal(gamestate.pieces[5].name,'Professor Plum');

gamestate.setupDecks();

gamestate.setupBoard();

checkAdjRooms([0,18,20,8]);
checkAdjRooms([18,0,1]);
checkAdjRooms([1,18,15,13]);
checkAdjRooms([13,2,1]);
checkAdjRooms([2,10,6,13]);
checkAdjRooms([10,2,4]);
checkAdjRooms([15,1,5]);
checkAdjRooms([20,0,3]);
checkAdjRooms([4,10,12,9]);
checkAdjRooms([12,4,5]);
checkAdjRooms([5,12,14,15,17]);
checkAdjRooms([17,5,3]);
checkAdjRooms([3,17,20,19]);
checkAdjRooms([19,3,6]);
checkAdjRooms([14,5,7]);
checkAdjRooms([9,4,8]);
checkAdjRooms([8,9,0,11]);
checkAdjRooms([11,8,7]);
checkAdjRooms([7,11,14,16]);
checkAdjRooms([16,7,6]);
checkAdjRooms([6,16,2,19]);

function checkAdjRooms(tempAdjRooms){
	for(var i=0;i<gamestate.board[tempAdjRooms[0]].adjoiningRooms.length;i++){
		assert.equal(gamestate.board[tempAdjRooms[0]].adjoiningRooms[i],tempAdjRooms[i+1]);
	}
}

assert.equal(gamestate.board[16].currentOccupant.name,'Miss Scarlet');
assert.equal(gamestate.board[19].currentOccupant.name,'Colonel Mustard');
assert.equal(gamestate.board[18].currentOccupant.name,'Mrs. White');
assert.equal(gamestate.board[13].currentOccupant.name,'Mr. Green');
assert.equal(gamestate.board[10].currentOccupant.name,'Mrs. Peacock');
assert.equal(gamestate.board[9].currentOccupant.name,'Professor Plum');


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

spectator1=new Spectator();
spectator1.initialize('Dan',127);
gamestate.addSpectator(spectator1);

assert.equal(gamestate.spectators[0].name,'Dan');


assert.equal(gamestate.players.length,3);
assert.equal(gamestate.players[0].name,'Al');
assert.equal(gamestate.players[1].name,'Sue');
assert.equal(gamestate.players[2].name,'Kim');
assert.equal(gamestate.players[0].sessionID,123);
assert.equal(gamestate.players[1].sessionID,124);
assert.equal(gamestate.players[2].sessionID,125);
assert.isNotUndefined(gamestate.getPlayerBySessionID(123));


//Test checkName function
assert.equal(gamestate.checkName('Al'),true);
assert.equal(gamestate.checkName('Dan'),false);


assert.equal(gamestate.currentChoosingPlayer,0);
gamestate.chosePieces('');
assert.equal(gamestate.currentChoosingPlayer,1);


gamestate.players[0].piece=gamestate.pieces[2];
gamestate.players[1].piece=gamestate.pieces[0];
gamestate.players[2].piece=gamestate.pieces[4];
gamestate.pieces[2].player=gamestate.players[0];
gamestate.pieces[0].player=gamestate.players[1];
gamestate.pieces[4].player=gamestate.players[2];


assert.equal(gamestate.pieces[0].location.name,'hall_8');
assert.equal(gamestate.pieces[1].location.name,'hall_11');
assert.equal(gamestate.pieces[2].location.name,'hall_10');
assert.equal(gamestate.pieces[3].location.name,'hall_5');
assert.equal(gamestate.pieces[4].location.name,'hall_2');
assert.equal(gamestate.pieces[5].location.name,'hall_1');

//Test the checkLocation function
assert.equal(gamestate.checkLocation(gamestate.players[1].sessionID,'hall'),true);
assert.equal(gamestate.checkLocation(gamestate.players[1].sessionID,'lounge'),true);
assert.equal(gamestate.checkLocation(gamestate.players[1].sessionID,'study'),false);

//Test getLocationByName function out
assert.equal(gamestate.getLocationByName('kitchen').name,'kitchen');

// Lets move player 0 and then see if we can move from that location
// That player should be blocked from moving into hall 11 because Colonel Mustard is there
gamestate.setPlayerLocation(gamestate.players[1],'lounge');
assert.equal(gamestate.players[1].piece.location.name,'lounge');
assert.equal(gamestate.pieces[0].location.name,'lounge');


assert.equal(gamestate.checkLocation(gamestate.players[1].sessionID,'hall_8'),true);
assert.equal(gamestate.checkLocation(gamestate.players[1].sessionID,'conservatory'),true);
assert.equal(gamestate.checkLocation(gamestate.players[1].sessionID,'hall_11'),false);

assert.equal(gamestate.getAvailableLocations(gamestate.players[1]).length,2);


gamestate.orderPlayers();
assert.equal(gamestate.turnList[0].name,gamestate.players[1].name);

//Test setCurrentPlayer function
//This should be Sue because she chose Miss Scarlet, not player 0
gamestate.setCurrentPlayer('');
assert.equal(gamestate.players[1].status,'currentPlayer');
assert.equal(gamestate.players[0].status,'notCurrentPlayer');
assert.equal(gamestate.players[2].status,'notCurrentPlayer');
assert.equal(gamestate.getCurrentPlayer(),gamestate.players[1]);
//Ne
gamestate.setCurrentPlayer('');
assert.equal(gamestate.players[0].status,'currentPlayer');
assert.equal(gamestate.players[1].status,'notCurrentPlayer');
assert.equal(gamestate.players[2].status,'notCurrentPlayer');


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
var falseAccusation={weapon:'',character:gamestate.caseFile.characterCard,room:gamestate.caseFile.roomCard};

assert.equal(gamestate.checkAccusation(trueAccusation),true);
assert.equal(gamestate.checkAccusation(falseAccusation),false);
