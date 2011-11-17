var sys = require('sys');
var assert = require("assert-extras");
var CaseFile=require('../casefile');
var Card = require('../card');

var weaponcard = new Card();
weaponcard.initialize('weapon','lead pipe');

var charactercard = new Card();
charactercard.initialize('character','Professor Plum');

var roomcard = new Card();
roomcard.initialize('room','hall');

var casefile = new CaseFile();
casefile.initialize(weaponcard,charactercard,roomcard);

assert.equal(casefile.weaponCard.value,'lead pipe');
assert.equal(casefile.characterCard.value,'Professor Plum');
assert.equal(casefile.roomCard.value,'hall');