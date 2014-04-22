/* jshint browser:true */
/* global require, module */

'use strict';

var _ = require('lodash');
var Q = require('q');

module.exports = Post;

function Post(identifier, connection) {
  _.extend(this, {
    _identifier: identifier,
    _postRoom: connection.get('rooms').get(1).invoke('join').get('room'),
    _comments: {}
  });

  this._initialize();
}

Post.prototype._initialize = function() {
  this._fetchComments();
  this._observeChanges();
};

Post.prototype._fetchComments = function() {
  this._postRoom
    .invoke('key', '/sections')
    .invoke('get')
    .get('value')
    .then(this._cacheComments.bind(this))
    .fail(function(err) {
      console.log('error fetching comments', err);
    });
};

// TODO: add set/remove handlers
Post.prototype._observeChanges = function() {
  var options = { bubble: true, local: true };
  var futureKey = this._postRoom.invoke('key', '/sections');

  futureKey.invoke('on', 'add', options, this._addHandler.bind(this));
};

Post.prototype._addHandler = function(comment, context) {
  var sectionName = _.last(context.key.split('/'));
  var commentId = _.last(context.addedKey.split('/'));

  this._comments[sectionName] = this._comments[sectionName] || {};
  this._comments[sectionName][commentId] = comment;
};

// TODO: collapse timestamp into comment object;
Post.prototype._cacheComments = function(comments) {
  this._comments = _.reduce(comments, function(collection, comment, key) {
    collection[key] = comment;

    return collection;
  }, {});
};

Post.prototype.addComment = function(sectionName, comment) {
  var keyName = 'sections/' + sectionName;

  return this._postRoom
    .invoke('key', keyName)
    .invoke('add', comment);
};

Post.prototype.getComments = function(sectionName) {
  // body...
};
