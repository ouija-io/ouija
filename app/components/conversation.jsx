/* jshint browser:true */
/* global require, module */

'use strict';

/**
 * @fileOverview
 *
 * Conversation React Component
 **/

var React = require('react');
var _ = require('lodash');

var CommentList = require('./comment-list');
var CommentForm = require('./comment-form');
var CommentControls = require('./comment-controls');

var Conversation = {};

Conversation.getInitialState = function() {
  return {
    comments: {},
    isActive: false,
    loading: true,
    count: 0
  };
};

Conversation.handleCommentSubmit = function(comment) {
  var sectionName = this.props.section;

  this.props.comments.add(sectionName, comment);
};

Conversation.componentWillMount = function() {
  var self = this;
  var comments = this.props.comments;

  comments.getComments(this.props.section).then(function(comments) {
    self.setState({ comments: comments, loading: false, count: _.keys(comments).length });
  }).fail(function(err) {
    console.log('wuh oh', err);
  });

  comments.on('newComment', function(sectionName) {
    if (sectionName !== self.props.section) return;

    self.props.comments.getComments(self.props.section).then(function(data) {
      self.setState({ comments: data, count: _.keys(data).length });
    });
  });
};

Conversation.render = function() {
  return (
    <div className="ouija">
      <CommentControls
        isLoading={ this.state.loading }
        commentCount={ this.state.count }
      />

      <div className="ouija-comments">
        <CommentList
          data={ this.state.comments } />
        <CommentForm
          onCommentSubmit={ this.handleCommentSubmit }
          onCommentCancel={ this.handleCommentClose }
          users={ this.props.users }
        />
      </div>
    </div>
  );
};

module.exports = React.createClass(Conversation);
