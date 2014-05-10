/* jshint browser:true */
/* global require, module, goinstant */

/**
 * @fileOverview
 *
 * This file contains the hot, gooey class at the center of Ouija
 **/

var _                 = require('lodash'),
    React             = require('react'),
    Post              = require('./post'),
    Users             = require('./users'),
    Conversation      = require('./components/conversation'),

    OUIJA_POST_CLASS  = 'post-ouija',
    ACTIVE_CLASS      = 'ouija-active',
    CONTROLS_CLASS    = '.ouija-controls',
    COMMENTS_CLASS    = '.ouija-comments',
    ARTICLE_SEL       = 'article',
    CONVERSATIONS_SEL = 'div.ouija',
    CANCEL_SEL        = 'div.ouija .ouija-cancel';

/**
 * The Ouija class is responsible for:
 *   (a) connecting to GoInstant
 *   (b) creating User & Post instances
 *   (c) identifying relevant DOM nodes
 *   (d) creating and inserting the Conversation components
 *
 * @public
 * @class
 * @constructor
 * @param {Object} config
 */
function Ouija(config) {
    _.extend(this, {
        url: config.connectUrl,
        identifier: config.identifier,
        articleContent: config.articleContent,
        sectionElements: config.sectionElements,
        el: {}
    });

    _.bindAll(this, [
        'handleControlsClick',
        'handleCommentsClick',
        'handleCollapseClick'
    ]);
}

Ouija.NAMESPACE = 'ouija';

Ouija.prototype.initialize = function() {
    this.connection = this.connect();
    this.users = new Users(this.connection);
    this.post = new Post(this.identifier, this.connection, this.users);

    this.el.activeConversation = null;
    this.el.article = $(ARTICLE_SEL);
    this.el.article.addClass(OUIJA_POST_CLASS);

    this.parseContent();
    this.labelSections();
    this.renderSections();
    this.registerListeners();
};

Ouija.prototype.connect = function () {
    var self = this;

    return goinstant.connect(this.url, {
        room: ['lobby', 'post_' + self.identifier]
    });
};

Ouija.prototype.getSections = function (content) {
    return content
            .children(this.sectionElements)
            .filter(function(el) {
                 return $(el).not(':empty');
            });
};

Ouija.prototype.parseContent = function () {
    this.el.content = $(this.articleContent);
    this.el.sections = this.getSections(this.el.content);
};

Ouija.prototype.labelSections = function () {
    var self = this;

    this.sections = {};

    _.each(this.el.sections, function (elem, index) {
        var sectionName = 'section_' + index;
        var $section = $('<section id="' + sectionName + '"></section>').appendTo(elem);

        self.sections[sectionName] = $section;
    });
};

Ouija.prototype.renderSections = function () {
    var self = this;

    _.each(self.sections, function ($section, sectionName) {
        React.renderComponent(
            Conversation(
                {comments: self.post, 
                users: self.users, 
                section: sectionName }
            ), $section[0]
        );
    });
};

Ouija.prototype.registerListeners = function () {
    $(CONTROLS_CLASS).on('click', this.handleControlsClick);
    $(CANCEL_SEL).on('click', this.handleCollapseClick);
    $(COMMENTS_CLASS).on('click', this.handleCommentsClick);
    $(document).on('click', this.handleCollapseClick);
};

Ouija.prototype.handleControlsClick = function (e) {
    e.preventDefault();

    var $conversation = $(e.target).closest(CONVERSATIONS_SEL);

    // Let the event bubble up to document to collapse conversation
    if ($conversation.hasClass(ACTIVE_CLASS)) {
        return;
    }

    // Don't let event bubble up to document
    e.stopPropagation();

    this.collapseCurrent();

    $conversation.addClass(ACTIVE_CLASS);
    this.el.article.addClass(ACTIVE_CLASS);

    this.el.activeConversation = $conversation;
};

Ouija.prototype.handleCommentsClick = function (e) {
    // Don't let event bubble up to document
    e.stopPropagation();
};

Ouija.prototype.handleCollapseClick = function () {
    this.collapseCurrent();

    this.el.article.removeClass(ACTIVE_CLASS);
};

Ouija.prototype.collapseCurrent = function () {
    if (!this.el.activeConversation) {
        return;
    }

    this.el.activeConversation.removeClass(ACTIVE_CLASS);
    this.el.activeConversation = null;
};

module.exports = Ouija;