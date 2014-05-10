/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * Comment Component
 **/

var React = require('react'),
    Commment = {};

Comment.render = function () {
    return (
        <div className="ouija-comment">
            <span className="ouija-avatar">
                <img src={ this.props.author.avatarUrl } alt="avatar"/>
            </span>
            <div className="ouija-author">
                <a href={ "https://twitter.com/" + this.props.author.username } alt="Timestamp">
                    { this.props.author.displayName }
                </a>
            </div>
            <div className="ouija-content">
                <p>{ this.props.children }</p>
            </div>
        </div>
    );
};

module.exports = React.createClass(Comment);
