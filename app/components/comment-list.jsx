/* jshint browser:true */
/* global require, module */

'use strict';

/**
 * @fileOverview
 *
 * Comment-list React Component
 **/

var React = require('react');
var _ = require('lodash');

var Comment = require('./comment');

var CommentList = {}

CommentList.componentWillUpdate = function() {
  var node = this.getDOMNode();

  if (node.scrollTop) {
    var scrollPos = node.scrollTop + node.offsetHeight;
    this.shouldScrollBottom = scrollPos >= node.scrollHeight*0.8;
  }
};

CommentList.componentDidUpdate = function() {
  if (this.shouldScrollBottom) {
    var node = this.getDOMNode();
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
