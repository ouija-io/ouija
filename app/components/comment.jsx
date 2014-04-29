/* jshint browser:true */
/* global require, module */

'use strict';

var React = require('react');

var Commment = module.exports = React.createClass({
  render: function() {
    var author = this.props.author;

    return (
      <div className="ouija-comment">
        <span className="ouija-avatar">
          <img src={ author.avatarUrl } alt="avatar"/>
        </span>
        <div className="ouija-author">
          <a href="https://twitter.com/{ author.username }" alt="Timestamp">
            { author.displayName }
          </a>
        </div>
        <div className="ouija-content">
          <p>{ this.props.children }</p>
        </div>
      </div>
    );
  }
});