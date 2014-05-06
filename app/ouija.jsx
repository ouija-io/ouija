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

var OUIJA_POST_CLASS = 'post-ouija';
var ACTIVE_CLASS = 'ouija-active';
var CONTROLS_CLASS = '.ouija-controls';
var COMMENTS_CLASS = '.ouija-comments';
var ARTICLE_SEL = 'article';
var CONVERSATIONS_SEL = 'div.ouija';
var CANCEL_SEL = 'div.ouija .ouija-cancel';

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
    _sectionElements: config.sectionElements,
    _el: {}
  });

  _.bindAll(this, [
    '_handleControlsClick',
    '_handleCommentsClick',
    '_handleCollapseClick'
  ]);
}

Ouija.NAMESPACE = 'ouija';

Ouija.prototype.initialize = function() {
  this._connection = this._connect();
  this._users = new Users(this._connection);
  this._post = new Post(this._identifier, this._connection, this._users);

  this._el.activeConversation = null;
  this._el.article = $(ARTICLE_SEL);
  this._el.article.addClass(OUIJA_POST_CLASS);

  this._parseContent();
  this._labelSections();
  this._renderSections();
  this._registerListeners();
};

Ouija.prototype._connect = function() {
  var self = this;

  return goinstant.connect(this._url, {
    room: ['lobby', 'post_' + self._identifier]
  });
};

Ouija.prototype._getSections = function(content) {
  return content
      .children(this._sectionElements)
      .filter(function(el) {
         return $(el).not(':empty');
      });
};

Ouija.prototype._parseContent = function() {
  this._el.content = $(this._articleContent);
  this._el.sections = this._getSections(this._el.content);
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

Ouija.prototype._registerListeners = function() {
  $(CONTROLS_CLASS).on('click', this._handleControlsClick);
  $(CANCEL_SEL).on('click', this._handleCollapseClick);
  $(COMMENTS_CLASS).on('click', this._handleCommentsClick);
  $(document).on('click', this._handleCollapseClick);
};

Ouija.prototype._handleControlsClick = function(e) {
  e.preventDefault();

  var $conversation = $(e.target).closest(CONVERSATIONS_SEL);

  // Let the event bubble up to document to collapse conversation
  if ($conversation.hasClass(ACTIVE_CLASS)) {
    return;
  }

  // Don't let event bubble up to document
  e.stopPropagation();

  this._collapseCurrent();

  $conversation.addClass(ACTIVE_CLASS);
  this._el.article.addClass(ACTIVE_CLASS);

  this._el.activeConversation = $conversation;
};

Ouija.prototype._handleCommentsClick = function(e) {
  // Don't let event bubble up to document
  e.stopPropagation();
};

Ouija.prototype._handleCollapseClick = function(e) {
  this._collapseCurrent();

  this._el.article.removeClass(ACTIVE_CLASS);
};

Ouija.prototype._collapseCurrent = function() {
  if (!this._el.activeConversation) {
    return;
  }

  this._el.activeConversation.removeClass(ACTIVE_CLASS);
  this._el.activeConversation = null;
};
