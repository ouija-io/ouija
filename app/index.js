/* jshint browser:true */
/* global require */

/**
 * @fileOverview
 *
 * We abstract retrieving the configuration options and instantiate Ouija here
 **/

var _     = require('lodash'),
    Ouija = require('./ouija'),
    DEFAULTS = {
        articleContent: '.post-content',
        sectionElements: "p, ol, :has(img)"
    },
    config,
    ouija;

config = {
    identifier: window.ouija_identifier, // Ghost Post UID
    connectUrl: window.ouija_connect_url, // GoInstant connect URL
    articleContent: window.ouija_article_content, // Selector for article content
    sectionElements: window.ouija_section_elements // Section selector
};

config = _.defaults(config, DEFAULTS);

ouija = new Ouija(config);

ouija.initialize();
