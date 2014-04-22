/* jshint browser:true */
/* global require */

'use strict';

// Ouija component class
var Ouija = require('./ouija');

var config = {
  // Unique identifier for each page where Ouija is present
  identifier: window.ouija_identifier,
  // GoInstant connect URL
  connect_url: window.ouija_connect_url
};

var ouija = new Ouija(config);

ouija.initialize();