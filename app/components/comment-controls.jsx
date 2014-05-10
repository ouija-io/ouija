/* jshint browser:true */
/* global require, module */

'use strict';

/**
 * @fileOverview
 *
 * Comment Controls React Component
 **/

var React = require('react'),
    AddControl,
    LoadControl,
    CountControl,
    CommentControls = {};

AddControl = React.createClass({
    render: function () {
        return (<a href="#" className="add"></a>);
    }
});

LoadControl = React.createClass({
    render: function () {
        return (
            <a href="#" className="loader">
                <span className="ouija-loader"></span>
            </a>
        );
    }
});

CountControl = React.createClass({
    render: function () {
        return (
            <a href="#" className="count">
                <span>{ this.props.count }</span>
            </a>
        );
    }
});

CommentControls.render = function () {
    var activeControl = (<LoadControl />);

    if (!this.props.isLoading) {
        activeControl = (
            <AddControl />
        );
    }

    if (this.props.commentCount) {
        activeControl = (
            <CountControl
                count={ this.props.commentCount }
            />
        );
    }

    return (
        <div className="ouija-controls">{ activeControl }</div>
    );
};

module.exports = React.createClass(CommentControls);
