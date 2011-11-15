var sys = require("sys");
var inspect = require('util').inspect;

var weaponsDeck;
var charactersDeck;
var roomsDeck;
var caseFile;

function Card(type, value){
	this.type=type;
	this.value=value;
}

function CardDeck(type){
	this.type=type;
	this.cards=[]
}

//This uses the Fisher-Yates shuffle algorithm, the inside-out version
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

function CaseFile(weaponCard,characterCard,roomCard){
	this.weaponsCard=weaponCard;
	this.charactersCard=characterCard;
	this.roomsCard=roomCard;
}

CaseFile.prototype.printFile=function(){
	sys.puts("Case File");
	sys.puts(this.weaponsCard);
	sys.puts(this.charactersCard);
	sys.puts(this.roomsCard);

}

function setupDeck(type,items){
	var i=0;
	var deck=new CardDeck(type);
	for(i=0;i<items.length;i++){
		var tempCard=new Card(type,items[i]);
		deck.cards[deck.cards.length]=tempCard;
	}
	deck.shuffle();
	return deck;
}

function setupDecks(){

	weaponsDeck = setupDeck('weapons',['candlestick','knife','lead pipe','revolver','rope','wrench']);
	charactersDeck = setupDeck('characters',['Mr. Mustard','Mr. Green','Mrs. Peacock','Ms. Scarlet','Mr. White','Mr. Plum']);
	roomsDeck = setupDeck('rooms',['kitchen','ballroom','conservatory','dining room','library','cellar','lounge','hall','study']);

	caseFile=new CaseFile(weaponsDeck.cards[0].value,charactersDeck.cards[0].value,roomsDeck.cards[0].value);
	weaponsDeck.cards.splice(0,1);
	charactersDeck.cards.splice(0,1);
	roomsDeck.cards.splice(0,1);
}

setupDecks();

weaponsDeck.printDeck();
charactersDeck.printDeck();
roomsDeck.printDeck();

caseFile.printFile();
