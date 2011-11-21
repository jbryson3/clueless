var sys = require('sys');
var assert = require("assert-extras");
var inspect = require('util').inspect;
var CardDeck = require('../carddeck');
var weaponsDeck = new CardDeck();

sys.puts("Running carddeck.js unit tests");

weaponsDeck.initialize('weapons',['candlestick','knife','lead pipe','revolver','rope','wrench']);
assert.equal(weaponsDeck.type,'weapons');
assert.equal(weaponsDeck.cards.length,6);
for(var i=0;i<weaponsDeck.cards.length;i++){
	assert.isNotUndefined(weaponsDeck.cards[i]);
}
