var sys = require('sys');
var assert = require("assert-extras");
var Card = require('../card');
var card = new Card();
assert.isObject(card);
card.initialize('weapon','lead pipe');
assert.equal(card.type,'weapon');
assert.equal(card.value,'lead pipe');
