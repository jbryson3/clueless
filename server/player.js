var sys = require("sys");

Player = function(){
	this.name='';
	this.sessionID='';
	this.cards=[];
	this.piece='';
	this.status='';
};

Player.prototype.initialize = function(name,sessionID){
	this.name=name;
	this.sessionID=sessionID;	
}

Player.prototype.printCards = function() {
	sys.puts(this.name + " Cards");
	for(var i=0;i<this.cards.length;i++){
		sys.puts(this.cards[i].value);
	}
	sys.puts('');
};

module.exports=Player;
