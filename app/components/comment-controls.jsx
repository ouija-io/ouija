/* jshint browser:true */
/* global require, module */

'use strict';

/**
 * @fileOverview
 *
 * Comment Controls React Component
 **/

var React = require('react');

var AddControl = React.createClass({
  render: function() {
    return (<a href="#" className="add" onClick={ this.props.onClick }></a>);
  }
});

var LoadControl = React.createClass({
  render: function() {
    return (
      <a href="#" className="loader">
        <span className="ouija-loader"></span>
      </a>
    );
  }
});

var CountControl = React.createClass({
  render: function() {
    return (
      <a href="#" className="count"  onClick={ this.props.onClick }>
        <span>{ this.props.count }</span>
      </a>
    );
  }
});

var CommentControls = {};

CommentControls.render = function() {
  var activeControl = (<LoadControl />);

  if (!this.props.isLoading) {
    activeControl = (
      <AddControl
        onClick={ this.props.onAddClick }
      />
    );
  }

  if (this.props.commentCount) {
    activeControl = (
      <CountControl
        onClick={ this.props.onAddClick }
        count={ this.props.commentCount }
      />
    );
  }

  return (
    <div className="ouija-controls">{ activeControl }</div>
  );
};

module.exports = React.createClass(CommentControls);
