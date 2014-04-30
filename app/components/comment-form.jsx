/* jshint browser:true */
/* global require, module */

'use strict';

/**
 * @fileOverview
 *
 * Comment Form React Component
 **/

var React = require('react');
var Q = require('q');

var Login = require('./login');

var CommentForm = {};

CommentForm.getInitialState = function() {
  return { user: {} };
};

CommentForm.componentWillMount = function() {
  var self = this;
  var users = this.props.users;

  Q.all([
    users.isGuest(),
    users.getSelf(),
    users.loginUrl()
  ]).spread(function(isGuest, currentUser, loginUrl) {
    if (isGuest) {
      return self.setState({
        isGuest: true,
        user: currentUser,
        loginComponent: (
          <Login loginUrl={ loginUrl } />
        )
      });
    }

    self.setState({ user: currentUser });
  }).fail(function(err) {
    console.log('ahh', err.stack);
  });
};

CommentForm.handleSubmit = function(e) {
  var content = this.refs.content.getDOMNode().value.trim();

  if (content) {
    this.props.onCommentSubmit({ content: content });
    this.refs.content.getDOMNode().value = '';
  }

  e.preventDefault();
};

CommentForm.handleCancel = function(e) {
  this.props.onCommentCancel();

  e.preventDefault();
};

CommentForm.render = function() {
  if (this.state && this.state.isGuest) return this.state.loginComponent;

  return (
    <form className="ouija-comment ouija-new" onSubmit={ this.handleSubmit }>
      <span className="ouija-avatar">
        <img src={ this.state.user.avatarUrl } alt="avatar"/>
      </span>
      <div className="ouija-author">
        <a
          href="https://twitter.com/{ this.state.user.username }"
          alt="{ this.state.user.displayName }">{ this.state.user.displayName }
        </a>
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
};

module.exports = React.createClass(CommentForm);
