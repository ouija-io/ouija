/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file should contain a Post model, except... it's a mess
 **/

var _       = require('lodash'),
    Emitter = require('emitter-component'),
    Q       = require('q');

Q.longStackSupport = true; // TODO: Remove in Beta

/**
 * The Post class abstracts retrieving and adding the comments associated
 * with a single Ghost article
 *
 * @public
 * @class
 * @constructor
 * @param {int} identifier - Post UID
 * @param {Deferred} connection - GoInstant connection promise
 * @param {Object} users - Users instance
 */
function Post(identifier, connection, users) {
    _.extend(this, {
        identifier: identifier,
        postRoom: connection.get('rooms').get(1).invoke('join').get('room'),
        comments: {},
        users: users,
        cached: Q.defer()
    });

    this.initialize();
}

Emitter(Post.prototype);

Post.prototype.initialize = function() {
    this.fetchComments();
    this.observeChanges();
};

Post.prototype.fetchComments = function () {
    this.postRoom
        .invoke('key', '/sections')
        .invoke('get')
        .get('value')
        .then(this.getUsers.bind(this))
        .then(this.cacheComments.bind(this))
        .then(this.cached.resolve)
        .fail(this.cached.reject);
};

// TODO: add set/remove handlers
Post.prototype.observeChanges = function () {
    var options = { bubble: true, local: true };
    var futureKey = this.postRoom.invoke('key', '/sections');

    futureKey.invoke('on', 'add', options, this.addHandler.bind(this));
};

Post.prototype.addHandler = function (comment, context) {
    var self = this;

    var sectionName = _.last(context.key.split('/'));
    var commentId = _.last(context.addedKey.split('/'));

    this.comments[sectionName] = this.comments[sectionName] || {};
    this.users.getUser(comment.userId).then(function(user) {
        comment.displayName = user.displayName;
        comment.avatarUrl = user.avatarUrl;
        comment.username = user.username;

        self.comments[sectionName][commentId] = comment;
        self.emit('newComment', sectionName);
    });
};

Post.prototype.getUsers = function (sections) {
    var self = this,
        deferred = Q.defer(),
        promises = [];

    _(sections).each(function( comments) {
        _(comments).each(function (comment) {
            var promise = self.users.getUser(comment.userId);
            promise.then(function (user) {

                comment.displayName = user.displayName;
                comment.avatarUrl = user.avatarUrl;
                comment.username = user.username;
            });

            promises.push(promise);
        });

    });

    Q.all(promises).then(function() {
        deferred.resolve(sections);
    });

    return deferred.promise;
};

Post.prototype.cacheComments = function (sections) {
    var self = this;

    _(sections).each(function(comments, sectionName) {
        self.comments[sectionName] = _.reduce(comments, function(o, comment, id) {
            comment.id = id;
            o[id] = comment;

            return o;
        }, {});
    });

    return this.comments;
};

Post.prototype.add = function (sectionName, comment) {
    var self = this,
        deferred = Q.defer(),
        keyName = 'sections/' + sectionName;

    this.users.getSelf().then(function (localUser) {
        comment.userId = localUser.id;

        self.postRoom
            .invoke('key', keyName)
            .invoke('add', comment)
            .then(deferred.resolve)
            .fail(deferred.reject);
    });

    return deferred.promise;
};

Post.prototype.getComments = function (sectionName) {
    var self = this;

    return this.cached.promise.then(function() {
        return _.sortBy(self.comments[sectionName], 'id') || null;
    });
};

module.exports = Post;
