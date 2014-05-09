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

AddControl = React.createClass({displayName: 'AddControl',
    render: function () {
        return (React.DOM.a( {href:"#", className:"add"}));
    }
});

LoadControl = React.createClass({displayName: 'LoadControl',
    render: function () {
        return (
            React.DOM.a( {href:"#", className:"loader"}, 
                React.DOM.span( {className:"ouija-loader"})
            )
        );
    }
});

CountControl = React.createClass({displayName: 'CountControl',
    render: function () {
        return (
            React.DOM.a( {href:"#", className:"count"}, 
                React.DOM.span(null,  this.props.count )
            )
        );
    }
});

CommentControls.render = function () {
    var activeControl = (LoadControl(null ));

    if (!this.props.isLoading) {
        activeControl = (
            AddControl(null )
        );
    }

    if (this.props.commentCount) {
        activeControl = (
            CountControl(
                {count: this.props.commentCount }
            )
        );
    }

    return (
        React.DOM.div( {className:"ouija-controls"},  activeControl )
    );
};

module.exports = React.createClass(CommentControls);
