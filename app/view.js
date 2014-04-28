/* jshint browser:true */
/* global require, module, $ */

'use strict';

var _ = require('lodash');

module.exports = CommentView;

function CommentView() {

}



// // Controller logic drifting into the view here
// CommentView.prototype._renderComments = function($el, sectionName) {
//   var $controls = $el.find('.ouija-controls');


//   this._post.getComments(sectionName)
//     .then(function(sectionComments) {
//       if (!sectionComments) return;

//       return _.reduce(sectionComments, function(collection, comment) {
//         collection.push(commentTemplate(comment));

//         return collection;
//       }, []);
//     })
//     .then(function(comments) {
//       var commentCount = comments && comments.length || 0;

//       $el.find('.ouija-comments section').empty();

//       $controls.find('.loader').remove();
//       $controls.find('.add').css('display', 'block');

//       if (commentCount) {
//         $el.find('.ouija-comments section').append(comments.join(''));
//         $el.find('.ouija').addClass('ouija-has-comments');
//         $controls.find('.add').hide();
//         $controls.find('.add.count').css('display', 'block').find('span').text(commentCount);
//       }
//     }).fail(function(err) {
//       console.log(err);
//     });

//   $controls.delegate('.add', 'click', function(e) {
//     e.preventDefault();

//     var $comments = $(e.target).parents('.ouija').find('.ouija-comments');

//     $('body').on('click', hideComments);

//     function hideComments(e) {
//       if($(e.target).parents('.ouija').find('.ouija-comments')[0] === $comments[0]) return;

//       $('.post-ouija').removeClass('ouija-active');
//       $el.find('.ouija').removeClass('ouija-active');
//       $('body').off('click', hideComments);
//     }

//     $('.post-ouija').addClass('ouija-active');
//     $el.find('.ouija').addClass('ouija-active');
//   });

// };

// CommentView.prototype._registerListeners = function() {
//   this._el.content.delegate('.ouija-new', 'submit', this._handleSave.bind(this));
//   this._el.content.delegate('.ouija-response-cancel', 'click', this._handleCancel.bind(this));
// };

// CommentView.prototype._handleCancel = function(e) {
//   e.preventDefault();
//   $('.post-ouija').removeClass('ouija-active');

//   $(e.target).parents('.ouija-content').find('textarea').val('');
//   $(e.target).closest('.ouija').removeClass('ouija-active');
// };

// CommentView.prototype._handleSave = function(e) {
//   e.preventDefault();

//   var $el = $(e.target);
//   var sectionName = $el.parents('.ouija').data('ouija-section-name');

//   var comment = {
//     content: $el.serializeObject().content
//   };

//   if (!comment.content) return;

//   this._post.addComment(sectionName, comment);
//   $el.find('textarea').val('');
// };

// CommentView.prototype.add = function(sectionName) {
//   this._renderComments(this._sections[sectionName], sectionName);
//   this._dScrollBottom(this._sections[sectionName]);
// };

// CommentView.prototype._scrollBottom = function($el) {
//   var $container = $el.find('.ouija-comments section');
//   var properties = {
//     scrollTop: $container[0].scrollHeight
//   };

//   $container.animate(properties, 'slow');
// };
