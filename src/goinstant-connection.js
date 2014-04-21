/* jshint browser:true */
/* global module, goinstant */

'use strict';

module.exports = Connection;

function Connection(config) {
  this.url = config.connectUrl;
}

Connection.prototype.ready = function() {
  return goinstant.connect(this.url).get('rooms').get(0);
};
