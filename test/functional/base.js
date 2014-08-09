/* jshint browser:false */
/* global module, window, require */

var Signer      = require('goinstant-auth').Signer,
    Q           = require('q'),
    _           = require('lodash'),
    GoInstant   = require('goinstant-rest').v1,
    config      = require('../../config/test'),

    SECTION_KEY = 'sections',
    APP_NAME    = 'ouija-example',
    POST_NAME   = 'post_1';

function createToken(secretKey, claim) {
    var signer = new Signer(secretKey),
        sign = Q.denodeify(signer.sign.bind(signer));

    return sign(claim);
}

function wipeKey() {
    var client     = new GoInstant(config.credentials),
        getApps    = Q.denodeify(client.apps.all.bind(client.apps)),
        getRooms   = Q.denodeify(client.apps.rooms.all.bind(client.apps)),
        removeKey  = Q.denodeify(client.keys.remove.bind(client.keys)),
        clientOpts = {};

    return getApps().get(0).then(function (apps) {
        clientOpts = { app_id: _.find(apps, { name: APP_NAME }).id };

        return getRooms(clientOpts).get(0);
    }).then(function (rooms) {
        clientOpts.room_id = _.find(rooms, { name: POST_NAME }).id;
        clientOpts.key = SECTION_KEY;

        return removeKey(clientOpts);
    });
}

function bypassLogin(token, postUrl, test) {
    return token.then(function (jwt) {
        test.data('ouija_jwt', jwt);

        return test.open(postUrl).execute(function () {
            window.ouija_jwt = this.data('ouija_jwt');
            window.ouija.initialize();
        });
    });
}

module.exports = {
    'post has content container': function (test) {
        test.open(config.postUrl)
            .assert.visible('.post-content')
            .done();
    },
    'sections have been assigned, comments are not visible': function (test) {
        test.open(config.postUrl)
            .execute(function () {
                window.ouija.initialize();
            })
            .assert.numberOfElements('.ouija', 15)
            .assert.numberOfVisibleElements('.ouija-comments').is.lt(1)
            .done();
    },
    'OAuth login redirects to Twitter': function (test) {
        test.open(config.postUrl)
            .execute(function () {
                window.ouija.initialize();
            })
            .waitForElement('.ouija')
            .click('.ouija:nth-child(1) a')
            .click('.ouija:nth-child(1) .ouija-login a')
            .assert.title().is('Twitter / Authorize an application')
            .done();
    },
    'login to comment': function (test) {
        var token = createToken(config.secretKey, config.fakeUserClaim);

        wipeKey().then(bypassLogin(token, config.postUrl, test)).then(function () {
            test.waitForElement('.ouija-has-comments')
                .click('.ouija:nth-child(1) a')
                .assert.numberOfVisibleElements('.ouija-comments').is(1)
                .type('.ouija:nth-child(1) textarea', 'functional comment test')
                .assert.val('.ouija:nth-child(1) textarea', 'functional comment test')
                .submit('.ouija:nth-child(1) .ouija-new')
                .assert.text('.ouija-has-comments:nth-child(1) .ouija-comment:last-child .ouija-content p').is('functional comment test')
                .screenshot('test/sc/:browser_:version/leave_comment.png')
                .done();
        });
    },
    'comments are visible': function (test) {
        test.open(config.postUrl)
            .execute(function () {
                window.ouija.initialize();
            })
            .waitForElement('.ouija-has-comments')
            .assert.numberOfElements('.ouija-has-comments', 1)
            .click('.ouija-has-comments:nth-child(1) a')
            .assert.numberOfVisibleElements('.ouija-comments').is(1)
            .screenshot('test/sc/:browser_:version/open_comments.png')
            .done();
    },
};

