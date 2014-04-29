/* jshint browser:true */
/* global require, module, goinstant */

'use strict';

var _ = require('lodash');
var React = require('react');

var Post = require('./post');
var Users = require('./users');
var Conversation = require('./components/conversation');

module.exports = Ouija;

function Ouija(config) {
  _.extend(this, {
    _url: config.connect_url,
    _identifier: config.identifier,
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

  $('article.post').addClass('post-ouija');
};

Ouija.prototype._connect = function() {
  var options = {
    room: ['lobby', this._getIdentifier()]
  };

  return goinstant.connect(this._url, options);
};

Ouija.prototype._getIdentifier = function() {
  if (!this._identifier) {
    return _.reject(document.location.pathname.split('/'), _.isEmpty)[0];
  }

  return 'post_' + window.ouija_identifier;
};

function CommentView(post, users) {

}

Ouija.prototype._parseContent = function() {
  this._el.content = $('.post-content');
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
