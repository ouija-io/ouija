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

var CommmentList = {}

CommmentList.render = function() {
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

module.exports = React.createClass(CommmentList);