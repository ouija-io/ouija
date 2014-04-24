/* jshint browser:true */
/* global require, module, $ */

'use strict';

var _ = require('lodash');

var commentTemplate = require('./templates/comment.hbs');
var responseTemplate = require('./templates/response.hbs');
var sectionTemplate = require('./templates/section.hbs');

module.exports = CommentView;

function CommentView(post, users) {
  _.extend(this, {
    _post: post,
    _users: users,
    _el: {}
  });

  this._parseContent();
  this._labelSections();
  this._renderSections();
  this._registerListeners();

  $('article.post').addClass('post-ouija');

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

    self._sections[sectionName] = $(el);
  });
};

CommentView.prototype._renderSections = function() {
  var self = this;

  this._users.getSelf().then(function(localUser) {
    _.each(self._sections, function($el, sectionName) {
      $el.append(sectionTemplate({sectionName: sectionName}));
      $el.find('.ouija-comments').append(responseTemplate(localUser));

      self._renderComments($el, sectionName);
    });
  });
};

// Controller logic drifting into the view here
CommentView.prototype._renderComments = function($el, sectionName) {
  this._post.getComments(sectionName)
    .then(function(sectionComments) {
      if (!sectionComments) return;

      return _.reduce(sectionComments, function(collection, comment) {
        collection.push(commentTemplate(comment));

        return collection;
      }, []);
    })
    .then(function(comments) {
      $el.find('.ouija-controls .add').on('click', function(e) {
        e.preventDefault();

        var $comments = $(e.target).parents('.ouija').find('.ouija-comments');

        setTimeout(function() {
          $('body').on('click', hideComments);
        }, 0);

        function hideComments(e) {
          if($(e.target).parents('.ouija').find('.ouija-comments')[0] === $comments[0]) return;

          $('.post-ouija').removeClass('ouija-active');
          $el.find('.ouija').removeClass('ouija-active');
          $('body').off('click', hideComments);
        }
        setTimeout(function() {
          $('.post-ouija').addClass('ouija-active');
          $el.find('.ouija').addClass('ouija-active');
        }, 0);
      });

      $el.find('.ouija-comments section').empty();
      $el.find('.ouija-comments section').append(comments.join(''));
    });
};

CommentView.prototype._registerListeners = function() {
  this._el.content.delegate('.ouija-new', 'submit', this._handleSave.bind(this));
};

CommentView.prototype._handleSave = function(e) {
  e.preventDefault();

  var $el = $(e.target);
  var sectionName = $el.parents('.ouija').data('ouija-section-name');

  var comment = {
    content: $el.serializeObject().content
  };

  this._post.addComment(sectionName, comment);
  $el.find('textarea').val('');
};

CommentView.prototype.add = function(sectionName) {
  this._renderComments(this._sections[sectionName], sectionName);
};
