/* jshint browser:true */
/* global require, module */

'use strict';

var React = require('react');

window.React = React;

var CommentForm = module.exports = React.createClass({
  render: function() {
    return (
      <form className="ouija-comment ouija-new">
        <span className="ouija-avatar"></span>
        <div className="ouija-author">
          <a href="https://twitter.com/" alt="Timestamp">Display Name</a>
        </div>
        <div className="ouija-content">
          <textarea name="content" placeholder="Leave a comment..."></textarea>
          <footer>
              <button className="text">Cancel</button>
              <button>Comment</button>
          </footer>
        </div>
      </form>
    );
  }
});