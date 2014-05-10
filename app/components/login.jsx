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
        <form className="ouija-comment ouija-login">
            <h5>Sign in to comment</h5>
            <a href={ this.props.loginUrl } className="ouija-button">
                <span className="icon-twitter"></span>
                Sign in with Twitter
            </a>
        </form>
    );
};

module.exports = React.createClass(Login);