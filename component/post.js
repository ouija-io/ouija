/* jshint browser:true */
/* global require, module */

'use strict';

var _ = require('lodash');
var Q = require('q');
var Emitter = require('emitter-component');

module.exports = Post;

function Post(identifier, connection) {
  _.extend(this, {
    _identifier: identifier,
    _postRoom: connection.get('rooms').get(1).invoke('join').get('room'),
    _comments: {},
    _cached: Q.defer()
  });

  this._initialize();
}

Emitter(Post.prototype);

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
    .then(this._cached.resolve)
    .fail(this._cached.reject);
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
  this.emit('newComment', sectionName);
};

Post.prototype._cacheComments = function(sections) {
  var self = this;

  _(sections).each(function(comments, sectionName) {
    self._comments[sectionName] = _.reduce(comments, function(o, comment, id) {
      comment.id = id;
      o[id] = comment;

      return o;
    }, {});
  });

  return this._comments;
};

Post.prototype.addComment = function(sectionName, comment) {
  var keyName = 'sections/' + sectionName;

  return this._postRoom
    .invoke('key', keyName)
    .invoke('add', comment);
};

Post.prototype.getComments = function(sectionName) {
  var self = this;

  return this._cached.promise.then(function() {
    return self._comments[sectionName] || null;
  });
};
