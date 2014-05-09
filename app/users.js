/*jshint browser: true */
/* global require, module */

/**
 * @fileOverview
 *
 * This file should contain a User model, except... it's a mess
 **/

var _ = require('lodash');
var Q = require('q');

Q.longStackSupport = true;

var USER_PROPERTIES = ['displayName', 'avatarUrl', 'id', 'username'];
var USER_METADATA = ['status'];

function Users(conn) {
  this._conn = conn;
  this._room = null;
  this._cacheKey = null;

  this._cache = {};
  this._users = {};
  this._localId = null;
  this._localDeferred = Q.defer();

  this._initialize();
}

Users.prototype._initialize = function() {
  var self = this;

  this._conn.then(function(result) {
    self._room = result.rooms[0];
    self._cacheKey = self._room.key('cachedUsers');

    return self._room.self().get();

  }).then(function(result) {
    var user = result.value;

    self._localId = user.id;
    self._updateUser(user);
  }).fail(this._localDeferred.reject);
};

Users.prototype._updateUser = function(user) {
  var self = this;

  this.isGuest().then(function(isGuest) {
    if (isGuest) {
      self._localDeferred.resolve(null);
      return;
    }

    user = _.pick(user, USER_PROPERTIES);
    self._cache[user.id] = user;

    self._localDeferred.resolve(user);

    _.each(user, function(value, property) {
      self._cacheKey.key(user.id).key(property).set(value);
    });
  });
};

Users.prototype.loginUrl = function() {
  var deferred = Q.defer();

  this._conn.then(function(result) {
    var url = result.connection.loginUrl('twitter');

    deferred.resolve(url);
  });

  return deferred.promise;
};

Users.prototype.logoutUrl = function() {
  var deferred = Q.defer();

  this._conn.then(function(result) {
    var url = result.connection.logoutUrl();

    deferred.resolve(url);
  });

  return deferred.promise;
};

Users.prototype.isGuest = function() {
  var deferred = Q.defer();

  this._conn.then(function(result) {
    var isGuest = result.connection.isGuest();

    deferred.resolve(isGuest);
  });

  return deferred.promise;
};

Users.prototype.getSelf = function() {
  return this._localDeferred.promise;
};

Users.prototype.getUser = function(id) {
  var deferred = Q.defer();

  var user = this._cache[id];

  if (user) {
    deferred.resolve(user);

  } else {
    this._cacheKey.key(id).get().then(function(result) {
      user = result.value;

      deferred.resolve(user);
    });
  }

  return deferred.promise;
};

module.exports = Users;
