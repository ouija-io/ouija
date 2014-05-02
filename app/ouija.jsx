/* jshint browser:true */
/* global require, module, goinstant */

'use strict';

/**
 * @fileOverview
 *
 * This file contains the hot, gooey class at the center of Ouija
 **/

var React = require('react');
var _ = require('lodash');

var Post = require('./post');
var Users = require('./users');

var Conversation = require('./components/conversation');

module.exports = Ouija;

/**
 * The Ouija class is responsible for:
 *   (a) connecting to GoInstant
 *   (b) creating User & Post instances
 *   (c) identifying relevant DOM nodes
 *   (d) creating and inserting the Conversation components
 *
 * @public
 * @class
 * @constructor
 * @param {Object} config
 */
function Ouija(config) {
  _.extend(this, {
    _url: config.connectUrl,
    _identifier: config.identifier,
    _articleContent: config.articleContent,
    _el: {}
  });
}

Ouija.NAMESPACE = 'ouija';

Ouija.prototype.initialize = function() {
  this._connection = this._connect();
  this._users = new Users(this._connection);
  this._post = new Post(this._identifier, this._connection, this._users);
  this._el = {};

  this._parseContent();
  this._labelSections();
  this._renderSections();

  $('article').addClass('post-ouija');
};

Ouija.prototype._connect = function() {
  var self = this;

  return goinstant.connect(this._url, {
    room: ['lobby', 'post_' + self._identifier]
  });
};

Ouija.prototype._parseContent = function() {
  this._el.content = $(this._articleContent);

  this._el.sections = _.reject(this._el.content.find('p, ol'), function(el) {
    return _($(el).text()).isEmpty();
  });
};

Ouija.prototype._labelSections = function() {
  var self = this;

  this._sections = {};

  _.each(this._el.sections, function(el, index) {
    var sectionName = 'section_' + index;
    var $section = $('<section id="' + sectionName + '"></section>').appendTo(el);

    self._sections[sectionName] = $section;
  });
};

Ouija.prototype._renderSections = function() {
  var self = this;

  _.each(self._sections, function($section, sectionName) {
    React.renderComponent(
      <Conversation
        comments={ self._post }
        users={ self._users }
        section={ sectionName }
      />, $section[0]
    );
  });
};
