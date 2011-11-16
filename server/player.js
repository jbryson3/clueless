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