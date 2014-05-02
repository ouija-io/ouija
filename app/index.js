/* jshint browser:true */
/* global require */

'use strict';

/**
 * @fileOverview
 *
 * We abstract retrieving the configuration options and instantiate Ouija here
 **/

var _ = require('lodash');
var Ouija = require('./ouija');

var DEFAULTS = {
  articleContent: '.post-content'
};

var config = {
  identifier: window.ouija_identifier,  // Ghost Post UID
  connectUrl: window.ouija_connect_url, // GoInstant connect URL
  articleContent: window.ouija_article_content // Selector for article content
};

config = _.defaults(config, DEFAULTS);

var ouija = new Ouija(config);

ouija.initialize();
