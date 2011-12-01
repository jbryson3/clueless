var util = require("util");

Player = function(){
	this.name='';
	this.sessionID='';
	this.cards=[];
	this.piece='';
	this.status='';
	this.type='';
	this.ready=false;
};

Player.prototype.initialize = function(name,sessionID,type){
	this.name=name;
	this.sessionID=sessionID;	
	this.type=type;	
}

Player.prototype.printCards = function() {
	util.puts(this.name + " Cards");
	for(var i=0;i<this.cards.length;i++){
		util.puts(this.cards[i].value);
	}
	util.puts('');
};

module.exports=Player;
