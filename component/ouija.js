/* jshint browser:true */
/* global require, module, goinstant, $ */

'use strict';

var _ = require('lodash');
var Post = require('./post');
var template = require('./template.hbs');

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
  this._post = new Post(this._identifier, this._connection);
  this._parseContent();
  this._labelSections();
  this._renderSections();
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
    var $el = $(el);

    $el.data(Ouija.NAMESPACE + '-section-name', sectionName);
    $el.append('<br><div class="ouija-comment-container"><p>----------</p></div>');

    self._sections[sectionName] = $(el);
  });
};

// TODO: Move into dedicated 'view' class
Ouija.prototype._renderSections = function() {
  _.each(this._sections, this._renderComments.bind(this));
};

Ouija.prototype._renderComments = function($section, sectionName) {
  this._post.getComments(sectionName).then(function(sectionComments) {
    if (!sectionComments) return;

    var commentsHtml = _.reduce(sectionComments, function(collection, comment) {
      collection.push(template(comment));

      return collection;
    }, []);

    $section.find('.ouija-comment-container').append(commentsHtml.join(''));
  });
};
