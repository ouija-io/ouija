/* jshint browser:true */
/* global require, module */

/**
 * @fileOverview
 *
 * Comment Component
 **/

var React = require('react'),
    Comment = {};

Comment.render = function () {
    return React.DOM.div({ className: 'ouija-comment'}, 
        React.DOM.span({ className: 'ouija-avatar'}, 
            React.DOM.img({ src: this.props.author.avatarUrl, alt: 'avatar'})
        ),
        React.DOM.div({ className:'ouija-author'}, 
            React.DOM.a({ href: 'https://twitter.com/' + this.props.author.username, alt: 'Timestamp'}, 
                 this.props.author.displayName 
            )
        ),
        React.DOM.div({ className: 'ouija-content'}, 
            React.DOM.p(null, this.props.children )
        )
    );
};

module.exports = React.createClass(Comment);
