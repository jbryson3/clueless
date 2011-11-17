var sys = require('sys');
var inspect = require('util').inspect;
var CardDeck = require('../carddeck');
var weaponsDeck = new CardDeck();
sys.puts(inspect(weaponsDeck));
//weaponsDeck.initialize('weapons',['candlestick','knife','lead pipe','revolver','rope','wrench']);
