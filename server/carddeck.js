var sys = require('sys');
var inspect = require('util').inspect;

//This uses the Fisher-Yates shuffle algorithm, the inside-out version
CardDeck = function(){
	this.type = '';
	this.cards = new Array;
}

CardDeck.prototype.shuffle=function(){
	var newCards = new Array;
	newCards[0]=this.cards[0];
	var i=0
	for(i=1;i<this.cards.length;i++){
		var randomNumber=Math.floor(Math.random()*i);
		newCards[i]=newCards[randomNumber];
		newCards[randomNumber]=this.cards[i];
	}
	this.cards=newCards;
}

CardDeck.prototype.printDeck=function(){
	sys.puts("Cards");
	var i=0
	for(i=0;i<this.cards.length;i++){
		sys.puts(this.cards[i].value);
	}
	sys.puts(" ");

}

//This function sets up an individual deck, do not call directly
CardDeck.prototype.initialize = function(type,items){
	var Card=require('./card');
	this.type=type;
	for(var i=0;i<items.length;i++){
		var tempCard=new Card();
		tempCard.initialize(type,items[i]);
		this.cards[this.cards.length]=tempCard;
	}
	this.shuffle();

	return this;
}

module.exports=CardDeck;