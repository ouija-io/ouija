/* jshint browser:true */
/* global require, module */

'use strict';

var React = require('react');

var CommentList = require('./comment-list');
var CommentForm = require('./comment-form');

var Conversation = module.exports = React.createClass({
  getInitialState: function() {
    return { comments: {} };
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
    var control = {
      loader: (<a href="#" className="loader"><span className="ouija-loader"></span></a>),
      add: (<a href="#" className="add">+</a>),
      count: (<a href="#" className="add count"><span></span></a>)
    };

    var controls = (
      <div className="ouija-controls">{ control.add }</div>
    );

    var conversation = (
      <div className="ouija ouija-active">
        { controls }

        <CommentList data={ this.state.comments } />
        <CommentForm />
      </div>
    );

    return conversation;
  }
});