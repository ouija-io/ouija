/* jshint browser:true */
/* global require, module */

'use strict';

var React = require('react/addons');

var CommentList = require('./comment-list');
var CommentForm = require('./comment-form');

var Conversation = module.exports = React.createClass({
  getInitialState: function() {
    return { comments: {}, isActive: false };
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
      self.setState({ comments: comments });
    }).fail(function(err) {
      console.log('wuh oh', err)
    });

    comments.on('newComment', function(sectionName) {
      if (sectionName !== self.props.section) return;

      self.props.comments.getComments(self.props.section).then(function(data) {
        self.setState({ comments: data });
      });
    });
  },
  render: function() {
    var cx = React.addons.classSet;
    var classes = cx({
      'ouija': true,
      'ouija-active': this.state.isActive
    });

    var control = {
      loader: (<a href="#" className="loader"><span className="ouija-loader"></span></a>),
      add: (<a href="#" className="add" onClick={this.handleAddClick}>+</a>),
      count: (<a href="#" className="add count"><span></span></a>)
    };

    var controls = (
      <div className="ouija-controls">{ control.add }</div>
    );

    return (
      <div className={ classes } onClick={ this.handleConvClick }>
        { controls }

        <div className="ouija-comments">
          <CommentList data={ this.state.comments } />
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
