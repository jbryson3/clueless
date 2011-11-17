assert=require('assert');

var Player = require('../player');
player=new Player();
player.initialize('Al',123)
assert.equal(player.name,'Al');
