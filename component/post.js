/* jshint browser:true */
/* global require, module, goinstant, $ */

'use strict';

var _ = require('lodash');

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
};

Post.prototype._fetchComments = function() {
  this._postRoom
    .invoke('key', '/sections')
    .invoke('get')
    .get('value')
    .then(this._cacheComments.bind(this))
    .fail(function() {
      console.log('error fetching comments', arguments);
    });
};

Post.prototype._cacheComments = function(comments) {
  this._comments = _.reduce(comments, function(collection, comment, key) {
    collection[key] = comment;

    return collection;
  }, {});

  console.log('cached comments', this._comments);
};

Post.prototype.addComment = function(sectionName) {
  this._postRoom
    .invoke('key', '/sections/' + sectionName)
    .invoke('set', {
      "author": 0,
      "content": "a sweet comment",
      "createdOn": "2011-01-27T11:40:52.280Z"
    })
    .then(function() {
      console.log(arguments)
    }, function() {
      console.log('error', arguments)
    })
};
