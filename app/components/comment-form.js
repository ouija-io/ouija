/* jshint browser:true */
/* global require, module */

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
                    Login({ loginUrl: loginUrl } )
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

CommentForm.handleKeyDown = function (e) {
    if (e.keyCode === 13 && (e.metaKey || e.ctrlKey)) {
        this.handleSubmit(e);
    }
};

CommentForm.render = function () {
    if (this.state && this.state.isGuest) {
        return this.state.loginComponent;
    }
    
    return React.DOM.form({ className: 'ouija-comment ouija-new', onSubmit: this.handleSubmit }, 
        React.DOM.span({ className: 'ouija-avatar'}, 
            React.DOM.img({ src: this.state.user.avatarUrl, alt: 'avatar'})
        ),
        React.DOM.div({ className: 'ouija-author'}, 
            React.DOM.a({
                href: 'https://twitter.com/' + this.state.user.username, 
                alt: this.state.user.displayName
            }, this.state.user.displayName),
            React.DOM.a({ className: 'ouija-button text', href: this.state.logoutUrl }, 'Logout')
        ),
        React.DOM.div({ className: 'ouija-content'}, 
            React.DOM.textarea({ ref: 'content', placeholder: 'Leave a comment...', onKeyDown: this.handleKeyDown}),
            React.DOM.footer(null, 
                React.DOM.button({ className: 'text ouija-cancel', onClick: this.handleCancel }, 'Cancel'),
                React.DOM.button({ type: 'submit'}, 'Comment')
            )
        )
    );
};

module.exports = React.createClass(CommentForm);
