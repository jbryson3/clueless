var sys = require('sys');
var assert = require("assert-extras");
var Piece = require('../piece');

var piece = new Piece();
piece.initialize('Professor Plum', true);
assert.equal(piece.name,'Professor Plum');
assert.equal(piece.available,true);