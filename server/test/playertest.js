assert=require('assert');

require('../player.js');
player=new Player('Al',123);
assert.equal(player.name,'Al');
