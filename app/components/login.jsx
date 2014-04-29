/* jshint browser:true */
/* global require, module */

'use strict';

var React = require('react');

var Login = module.exports = React.createClass({
  render: function() {
    return (
      <form className="ouija-comment ouija-login">
          <h5>Sign in to comment</h5>
          <a href={ this.props.loginUrl } className="ouija-button">
            <span class="icon-twitter"></span>
            Sign in with Twitter
          </a>
      </form>
    );
  }
});