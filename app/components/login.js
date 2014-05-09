/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * Login React Component
 **/

var React = require('react'),
    Login = {};

Login.render = function () {
    return (
        React.DOM.form( {className:"ouija-comment ouija-login"}, 
            React.DOM.h5(null, "Sign in to comment"),
            React.DOM.a( {href: this.props.loginUrl,  className:"ouija-button"}, 
                React.DOM.span( {className:"icon-twitter"}),
                "Sign in with Twitter"
            )
        )
    );
};

module.exports = React.createClass(Login);