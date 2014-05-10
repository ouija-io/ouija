/* jshint browser:true */
/* global require, module */

'use strict';

/**
 * @fileOverview
 *
 * Comment-list React Component
 **/

var _           = require('lodash'),
    React       = require('react'),
    Comment     = require('./comment'),
    CommentList = {};

CommentList.componentWillUpdate = function () {
    var node = this.getDOMNode(),
        scrollPosition;

    if (node.scrollTop) {
        scrollPosition = node.scrollTop + node.offsetHeight;
        this.shouldScrollBottom = scrollPosition >= node.scrollHeight*0.8;
    }
};

CommentList.componentDidUpdate = function () {
    var node;

    if (this.shouldScrollBottom) {
        node = this.getDOMNode();
        node.scrollTop = node.scrollHeight;
    }
}

CommentList.render = function() {
    var commentNodes = _.map(this.props.data, function (comment, id) {
        var author = _.pick(comment, [
            'displayName',
            'userId',
            'username',
            'avatarUrl'
        ]);

        return (<Comment key={id} author={author}>{comment.content}</Comment>);
    });

    return (<div>{ commentNodes }</div>);
};

module.exports = React.createClass(CommentList);
