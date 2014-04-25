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
    _dScrollBottom: _.debounce(this._scrollBottom, 100),
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

  _.each(self._sections, function($el, sectionName) {
    $el.append(sectionTemplate({sectionName: sectionName}));

    self._users.isGuest().then(function(isGuest) {
      if (!isGuest) {
        return self._users.getSelf();
      }

      return self._users.loginUrl();

    }).then(function(result) {
      if (_.isString(result)) {
        console.log(result);
        //TODO show login button for guests instead of form
        //$el.find('.ouija-comments').append(authTemplate());

      } else {
        $el.find('.ouija-comments').append(responseTemplate(result));
      }

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
      var $controls = $el.find('.ouija-controls');

      $controls.find('.loader').hide();
      $controls.find('.add').css('display', 'block');

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
  this._el.content.delegate('.ouija-response-cancel', 'click', this._handleCancel.bind(this));
};

CommentView.prototype._handleCancel = function(e) {
  e.preventDefault();
  $('.post-ouija').removeClass('ouija-active');

  $(e.target).parents('.ouija-content').find('textarea').val('');
  $(e.target).closest('.ouija').removeClass('ouija-active');
};

CommentView.prototype._handleSave = function(e) {
  e.preventDefault();

  var $el = $(e.target);
  var sectionName = $el.parents('.ouija').data('ouija-section-name');

  var comment = {
    content: $el.serializeObject().content
  };

  if (!comment.content) return;

  this._post.addComment(sectionName, comment);
  $el.find('textarea').val('');
};

CommentView.prototype.add = function(sectionName) {
  this._renderComments(this._sections[sectionName], sectionName);
  this._dScrollBottom(this._sections[sectionName]);
};

CommentView.prototype._scrollBottom = function($el) {
  var $container = $el.find('.ouija-comments section');
  var properties = {
    scrollTop: $container[0].scrollHeight
  };

  $container.animate(properties, 'slow');
};
