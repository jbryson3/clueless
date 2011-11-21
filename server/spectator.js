var util = require('util');

Spectator = function(){
	this.name='';
	this.sessionID='';
};

Spectator.prototype.initialize = function(name,sessionID){
	this.name=name;
	this.sessionID=sessionID;	
}

module.exports=Spectator;