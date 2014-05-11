/*jshint browser: true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file should contain a User model, except... it's a mess
 **/

var _ = require('lodash'),
    Q = require('q'),

    USER_PROPERTIES = ['displayName', 'avatarUrl', 'id', 'username'];

Q.longStackSupport = true;

function Users(conn) {
    this.conn = conn;
    this.room = null;
    this.cacheKey = null;

    this.cache = {};
    this.users = {};
    this.localId = null;
    this.localDeferred = Q.defer();

    this.initialize();
}

Users.prototype.initialize = function () {
    var self = this;

    this.conn.then(function (result) {
        self.room = result.rooms[0];
        self.cacheKey = self.room.key('cachedUsers');

        return self.room.self().get();

    }).then(function (result) {
        var user = result.value;

        self.localId = user.id;
        self.updateUser(user);
    }).fail(this.localDeferred.reject);
};

Users.prototype.updateUser = function (user) {
    var self = this;

    this.isGuest().then(function (isGuest) {
        if (isGuest) {
            self.localDeferred.resolve(null);
            return;
        }

        user = _.pick(user, USER_PROPERTIES);
        self.cache[user.id] = user;

        self.localDeferred.resolve(user);

        _.each(user, function (value, property) {
            self.cacheKey.key(user.id).key(property).set(value);
        });
    });
};

Users.prototype.loginUrl = function () {
    var deferred = Q.defer();

    this.conn.then(function(result) {
        var url = result.connection.loginUrl('twitter');

        deferred.resolve(url);
    });

    return deferred.promise;
};

Users.prototype.logoutUrl = function () {
    var deferred = Q.defer();

    this.conn.then(function (result) {
        var url = result.connection.logoutUrl();

        deferred.resolve(url);
    });

    return deferred.promise;
};

Users.prototype.isGuest = function () {
    var deferred = Q.defer();

    this.conn.then(function (result) {
        var isGuest = result.connection.isGuest();

        deferred.resolve(isGuest);
    });

    return deferred.promise;
};

Users.prototype.getSelf = function () {
    return this.localDeferred.promise;
};

Users.prototype.getUser = function(id) {
    var deferred = Q.defer();

    var user = this.cache[id];

    if (user) {
        deferred.resolve(user);
    } else {
        this.cacheKey.key(id).get().then(function (result) {
            user = result.value;

            deferred.resolve(user);
        });
    }

    return deferred.promise;
};

module.exports = Users;
