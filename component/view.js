/* jshint browser:true */
/* global require, module, $ */

'use strict';

var _ = require('lodash');

var commentTemplate = require('./templates/comment.hbs');
var responseTemplate = require('./templates/response.hbs');
var sectionTemplate = require('./templates/section.hbs');

module.exports = CommentView;

function CommentView(post) {
  _.extend(this, {
    _post: post,
    _el: {}
  });

  this._parseContent();
  this._labelSections();
  this._renderSections();
  this._registerListeners();

  _.bindAll(this, ['add']);
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

    self._sections[sectionName] = $(el);
  });
};

CommentView.prototype._renderSections = function() {
  _.each(this._sections, this._renderComments.bind(this));
};

// Controller logic drifting into the view here
CommentView.prototype._renderComments = function($section, sectionName) {
  $section.empty();
  $section.append(sectionTemplate({sectionName: sectionName}));

  this._post.getComments(sectionName)
    .then(function(sectionComments) {
      if (!sectionComments) return;

      var commentsHtml = _.reduce(sectionComments, function(collection, comment) {
        collection.push(commentTemplate(comment));

        return collection;
      }, []);

      $section.find('.ouija-section').append(commentsHtml.join(''));
    })
    .then(function() {
      $section.find('.ouija-section').append(responseTemplate());
    });
};

CommentView.prototype.add = function(sectionName) {
  this._renderComments(this._sections[sectionName], sectionName);
};

CommentView.prototype._registerListeners = function() {
  this._el.content.delegate('.ouija-response-save', 'click', this._handleSave.bind(this));
};

CommentView.prototype._handleSave = function(e) {
  var $el = $(e.target);
  var sectionName = $el.parents('.ouija-section').data('ouija-section-name');

  var comment = {
    content: $el.parents('.ouija-response').find('textarea').val()
  };

  this._post.addComment(sectionName, comment);
};
