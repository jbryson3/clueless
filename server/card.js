Card = function(){
	this.type='';
	this.value='';
}

Card.prototype.initialize = function(type, value){
	this.type=type;
	this.value=value;	
}

module.exports=Card;


