/* jshint browser:true */
/* global require */

'use strict';

var Connection = require('./goinstant-connection');
var _ = require('lodash');

var conn = new Connection({
  connectUrl: 'https://goinstant.net/mattcreager/ouija-example'
});

conn.ready().then(function(lobby) {
  console.log(lobby);
});

function getCurrentPost() {
  return _.reject(document.location.pathname.split('/'), _.isEmpty)[0];
}

console.log(getCurrentPost());
