/* jshint browser:true */
/* global require, module */

'use strict';

/**
 * @fileOverview
 *
 * Conversation React Component
 **/

var _               = require('lodash'),
    React           = require('react/addons'),
    CommentList     = require('./comment-list'),
    CommentForm     = require('./comment-form'),
    CommentControls = require('./comment-controls'),
    Conversation    = {};

Conversation.getInitialState = function () {
    return {
        comments: {},
        isActive: false,
        loading: true,
        count: 0
    };
};

Conversation.handleCommentSubmit = function (comment) {
    var sectionName = this.props.section;

    this.props.comments.add(sectionName, comment);
};

Conversation.componentWillMount = function () {
    var self = this,
        comments = this.props.comments;

    comments.getComments(this.props.section).then(function (comments) {
        self.setState({ comments: comments, loading: false, count: _.keys(comments).length });
    }).fail(function (err) {
        // ToDo: Proper error handling :)
        console.log('wuh oh', err);
    });

    comments.on('newComment', function (sectionName) {
        if (sectionName !== self.props.section) return;

        self.props.comments.getComments(self.props.section).then(function (data) {
            self.setState({ comments: data, count: _.keys(data).length });
        });
    });
};

Conversation.render = function () {
    var cx = React.addons.classSet,
        classes = cx({
            'ouija-has-comments': this.state.count
        });

    return (
        <div className={ "ouija " + classes }>
            <CommentControls
                isLoading={ this.state.loading }
                commentCount={ this.state.count }
            />

            <div className="ouija-comments">
                <CommentList
                    data={ this.state.comments } />
                <CommentForm
                    onCommentSubmit={ this.handleCommentSubmit }
                    onCommentCancel={ this.handleCommentClose }
                    users={ this.props.users }
                />
            </div>
        </div>
    );
};

module.exports = React.createClass(Conversation);
