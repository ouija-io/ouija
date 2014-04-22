/* jshint browser:true */
/* global require, module, $ */

'use strict';

var _ = require('lodash');
var template = require('./template.hbs');

module.exports = CommentView;

function CommentView(post) {
  _.extend(this, {
    _post: post,
    _el: {}
  });

  this._parseContent();
  this._labelSections();
  this._renderSections();
}

CommentView.prototype._parseContent = function() {
 this._el.content = $('.post-content');
 this._el.sections = _.reject(this._el.content.find('p, ol'), function(el) {
  return _($(el).text()).isEmpty();
 });
};

CommentView.prototype._labelSections = function() {
  var self = this;

  this._sections = {};

  _.each(this._el.sections, function(el, index) {
    var sectionName = 'section_' + index;
    var $el = $(el);

    $el.data(CommentView.NAMESPACE + '-section-name', sectionName);
    $el.append('<br><div class="ouija-comment-container"><p>----------</p></div>');

    self._sections[sectionName] = $(el);
  });
};

CommentView.prototype._renderSections = function() {
  _.each(this._sections, this._renderComments.bind(this));
};

CommentView.prototype._renderComments = function($section, sectionName) {
  this._post.getComments(sectionName).then(function(sectionComments) {
    if (!sectionComments) return;

    var commentsHtml = _.reduce(sectionComments, function(collection, comment) {
      collection.push(template(comment));

      return collection;
    }, []);

    $section.find('.ouija-comment-container').append(commentsHtml.join(''));
  });
};