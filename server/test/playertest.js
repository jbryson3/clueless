var assert=require('assert');
var sys = require('sys');
var Player = require('../player');

sys.puts("Running player.js unit tests");

player=new Player();
player.initialize('Al',123)
assert.equal(player.name,'Al');
