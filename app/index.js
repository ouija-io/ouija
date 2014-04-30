/* jshint browser:true */
/* global require */

'use strict';

/**
 * @fileOverview
 *
 * We abstract retrieving the configuration options and instantiate Ouija here
 **/

var Ouija = require('./ouija');

var config = {
  identifier: window.ouija_identifier,  // Ghost Post UID
  connect_url: window.ouija_connect_url // GoInstant connect URL
};

var ouija = new Ouija(config);

ouija.initialize();
