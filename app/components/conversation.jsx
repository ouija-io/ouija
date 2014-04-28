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
    var $currentConversation = $(self.getDOMNode())
    var $document = $(document)

    $document.on('click', hideComments);
    $currentConversation.on('click', voidClick);

    function voidClick(e) {
      e.stopPropagation();
      return false;
    }

    function hideComments() {
      $document.off('click', hideComments);
      $currentConversation.off('click', voidClick);
      $post.removeClass('ouija-active');
      self.setState({ isActive: !self.state.isActive });
    }

    $post.addClass('ouija-active');
  },
  handleAddClick: function(e) {
    e.preventDefault();

    this.monitorComments();
    this.setState({ isActive: !this.state.isActive });
  },
  handleConvClick: function(e) {
    e.stopPropagation();
  },
  componentWillMount: function() {
    var self = this;

    this.props.comments.getComments(this.props.section).then(function(data) {
      self.setState({ comments: data });
    }).fail(function(err) {
      console.log('error during conversation mount', err);
    });

    this.props.comments.on('newComment', function(sectionName) {
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

    var conversation = (
      <div className={ classes } onClick={ this.handleConvClick }>
        { controls }

        <CommentList data={ this.state.comments } />
        <CommentForm />
      </div>
    );

    return conversation;
  }
});
