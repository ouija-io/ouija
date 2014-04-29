/* jshint browser:true */
/* global require, module */

'use strict';

var React = require('react/addons');
var _ = require('lodash');

var CommentList = require('./comment-list');
var CommentForm = require('./comment-form');
var CommentControls = require('./comment-controls');

var Conversation = module.exports = React.createClass({
  getInitialState: function() {
    return { comments: {}, isActive: false, loading: true, count: 0 };
  },
  monitorComments: function() {
    var self = this;

    var $post = $('.post-ouija');
    var $currentConversation = $(self.getDOMNode());
    var $document = $(document);
    var disregardEvent = false;

    this.voidClick = function(e) {
      self.disregardEvent = true;
    }

    $document.on('click', this.hideComments);
    $currentConversation.on('click', this.voidClick);

    $post.addClass('ouija-active');
  },
  hideComments: function() {
    var self = this;

    if (self.disregardEvent) {
      self.disregardEvent = false;
      return;
    };

    var $post = $('.post-ouija');
    var $currentConversation = $(self.getDOMNode());
    var $document = $(document);

    $document.off('click', this.hideComments);
    $currentConversation.off('click', this.voidClick);
    $post.removeClass('ouija-active');
    self.setState({ isActive: false });
  },
  handleAddClick: function(e) {
    if (!this.state.isActive) {
      this.monitorComments();
    }

    this.setState({ isActive: !this.state.isActive });
    e.preventDefault();
  },
  handleConvClick: function(e) {
    e.stopPropagation();
  },
  handleCommentSubmit: function(comment) {
    var sectionName = this.props.section;

    this.props.comments.add(sectionName, comment);
  },
  handleCommentClose: function() {
    this.hideComments();
  },
  componentWillMount: function() {
    var self = this;
    var comments = this.props.comments;

    comments.getComments(this.props.section).then(function(comments) {
      self.setState({ comments: comments, loading: false, count: _.keys(comments).length });
    }).fail(function(err) {
      console.log('wuh oh', err)
    });

    comments.on('newComment', function(sectionName) {
      if (sectionName !== self.props.section) return;

      self.props.comments.getComments(self.props.section).then(function(data) {
        self.setState({ comments: data, count: _.keys(data).length });
      });
    });
  },
  render: function() {
    var cx = React.addons.classSet;
    var classes = cx({
      'ouija': true,
      'ouija-active': this.state.isActive
    });

    return (
      <div className={ classes } onClick={ this.handleConvClick }>
        <CommentControls
            isLoading={ this.state.loading }
            commentCount={ this.state.count }
            onAddClick={ this.handleAddClick }
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
  }
});
