/* jshint browser:true */
/* global require, module */

'use strict';

var React = require('react');
var Q = require('q');

var Login = require('./login');

window.React = React;

var CommentForm = module.exports = React.createClass({
  getInitialState: function() {
    return { user: {} };
  },
  componentWillMount: function() {
    var self = this;
    var users = this.props.users;

    Q.all([
      users.isGuest(),
      users.getSelf(),
      users.loginUrl()
    ]).spread(function(isGuest, currentUser, loginUrl) {
      if (isGuest) {
        self.setState({ isGuest: true, loginComponent: (
          <Login loginUrl={ loginUrl } />) }
        );
      }

      self.setState({ user: currentUser });
    }).fail(function(err) {
      console.log('ahh', err.stack);
    })
  },
  handleSubmit: function(e) {
    var content = this.refs.content.getDOMNode().value.trim();

    this.props.onCommentSubmit({ content: content });
    this.refs.content.getDOMNode().value = '';

    e.preventDefault();
  },
  handleCancel: function(e) {
    this.props.onCommentCancel();

    e.preventDefault();
  },
  render: function() {
    if (this.state && this.state.isGuest) return this.state.loginComponent;

    return (
      <form className="ouija-comment ouija-new" onSubmit={ this.handleSubmit }>
        <span className="ouija-avatar">
          <img src={ this.state.user.avatarUrl } alt="avatar"/>
        </span>
        <div className="ouija-author">
          <a
            href="https://twitter.com/{ this.state.user.username }"
            alt="{ this.state.user.displayName }">{ this.state.user.displayName }</a>
          <button className="text" href="#">Logout</button>
        </div>
        <div className="ouija-content">
          <textarea ref="content" placeholder="Leave a comment..."></textarea>
          <footer>
              <button className="text" onClick={ this.handleCancel }>Cancel</button>
              <button type="submit">Comment</button>
          </footer>
        </div>
      </form>
    );
  }
});
