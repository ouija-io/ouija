/* jshint browser:true */
/* global require, module */

'use strict';

/**
 * @fileOverview
 *
 * Comment Form React Component
 **/

var React = require('react'),
    Q = require('q'),
    Login = require('./login'),
    CommentForm = {};

CommentForm.getInitialState = function () {
    return { user: {} };
};

CommentForm.componentWillMount = function () {
    var self = this,
        users = this.props.users;

    Q.all([
        users.isGuest(),
        users.getSelf(),
        users.logoutUrl(),
        users.loginUrl()
    ]).spread(function (isGuest, currentUser, logoutUrl, loginUrl) {
        if (isGuest) {
            return self.setState({
                isGuest: true,
                user: null,
                loginComponent: (
                    <Login loginUrl={ loginUrl } />
                )
            });
        }

        self.setState({
            user: currentUser,
            logoutUrl: logoutUrl
        });
    }).fail(function (err) {
        // ToDo: Do proper error handling :-)
        console.log('ahh', err.stack);
    });
};

CommentForm.handleSubmit = function (e) {
    var content = this.refs.content.getDOMNode().value.trim();

    if (content) {
        this.props.onCommentSubmit({ content: content });
        this.refs.content.getDOMNode().value = '';
    }

    e.preventDefault();
};

CommentForm.handleCancel = function (e) {
    this.props.onCommentCancel();

    e.preventDefault();
};

CommentForm.render = function () {
    if (this.state && this.state.isGuest) {
        return this.state.loginComponent;
    }
    
    return (
        <form className="ouija-comment ouija-new" onSubmit={ this.handleSubmit }>
            <span className="ouija-avatar">
                <img src={ this.state.user.avatarUrl } alt="avatar"/>
            </span>
            <div className="ouija-author">
                <a
                    href={ "https://twitter.com/" + this.state.user.username }
                    alt="{ this.state.user.displayName }">{ this.state.user.displayName }
                </a>
                <a className="ouija-button text" href={ this.state.logoutUrl }>Logout</a>
            </div>
            <div className="ouija-content">
                <textarea ref="content" placeholder="Leave a comment..."></textarea>
                <footer>
                    <button className="text ouija-cancel" onClick={ this.handleCancel }>Cancel</button>
                    <button type="submit">Comment</button>
                </footer>
            </div>
        </form>
    );
};

module.exports = React.createClass(CommentForm);
