/* jshint browser:true */
/* global require, module */

'use strict';

var React = require('react');


var AddControl = React.createClass({
  render: function() {
    return (<a href="#" className="add" onClick={ this.props.onClick }>+</a>);
  }
});

var LoadControl = React.createClass({
  render: function() {
    return (<a href="#" className="loader"><span className="ouija-loader"></span></a>);
  }
});

var CountControl = React.createClass({
  render: function() {
    return (<a href="#" className="count"  onClick={ this.props.onClick }><span>{ this.props.count }</span></a>);
  }
});

var CommentControls = module.exports = React.createClass({
  render: function() {
    var isLoading = this.props.isLoading;
    var count = this.props.commentCount;

    var activeControl = (<LoadControl />);

    if (!isLoading) {
      activeControl = (<AddControl onClick={ this.props.onAddClick } />);
    }

    if (count) {
      activeControl = (<CountControl onClick={ this.props.onAddClick } count={ count } />);
    }

    return (<div className="ouija-controls">{ activeControl }</div>);
  }
});
