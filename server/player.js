var util = require("util");

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
	util.puts(this.name + " Cards");
	for(var i=0;i<this.cards.length;i++){
		util.puts(this.cards[i].value);
	}
	util.puts('');
};

module.exports=Player;
