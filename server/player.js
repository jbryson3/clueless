var sys = require("sys");

Player = function(name, sessionID){
	this.name=name;
	this.sessionID=sessionID;
	this.cards=[];
	this.piece='';
	this.status='';
};

Player.prototype.printCards = function() {
	sys.puts(this.name + " Cards");
	for(var i=0;i<this.cards.length;i++){
		sys.puts(this.cards[i].value);
	}
	sys.puts('');
};

Player.prototype.orderPlayers = function(){
	for(var i=0;i<gameState.pieces.length;i++){
		if(gameState.pieces[i].player!=''){
			turnList[i]=gameState.pieces[i].player;
		}
	}
}
