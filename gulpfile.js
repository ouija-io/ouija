/* jshint node:true */

var gulp            = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    plugins         = gulpLoadPlugins(),
    _               = require('lodash'),
    async           = require('async'),
    Hipchat         = require('node-hipchat'),
    GitHubApi       = require('github'),
    semver          = require('semver'),
    config          = {},
    pathTo,

    HIPCHAT_TOKEN   = process.env.HIPCHAT_TOKEN || null,
    HIPCHAT_ROOMS   = process.env.HIPCHAT_ROOMS ? process.env.HIPCHAT_ROOMS.split(',') : null,
    AWS_S3_ID       = process.env.AWS_S3_ID || null,
    AWS_S3_SECRET   = process.env.AWS_S3_SECRET || null,
    ACCOUNT         = process.env.TRAVIS_REPO_SLUG ? process.env.TRAVIS_REPO_SLUG.split('/')[0] : null,
    REPO            = process.env.TRAVIS_REPO_SLUG ? process.env.TRAVIS_REPO_SLUG.split('/')[1] : null,
    TAG             = process.env.TRAVIS_TAG || null,
    NAMESPACE       = process.env.GOINSTANT_NAMESPACE || null,

    BUCKET_PROD     = 'cdn.goinstant.net',
    BUCKET_STAGING  = 'cdn.platform-staging.goinstant.org',
    LATEST          = 'latest',
    GLOBALS         = {},
    STAGING_REGEX   = /^v\d+.\d+.\d+-rc$/i,
    TEMPLATE        = 'Update of <a href="http://github.com/<%- account %>/<%- repo %>/releases/tag/<%- tag %>">' +
                      '<%- repo %>:<%- tag %><%- latest %></a> to <a href="<%- cdn %><%- repo %>.js"><%- env %></a>' +
                      ' was successful!',

    ERROR_ENV       = 'Missing environment parameter: gulp deploy --production.',
    ERROR_NO_TAG    = 'No tag found on TRAVIS_TAG env variable.',
    ERROR_HC        = 'Failed to send deploy notification.';

try {
    config = require('./config/ouija.json');
} catch(e) {
    console.log('ouija.json not found in config/');
}

pathTo = {
    assets: '../../themes/' + config.theme + '/assets/',
    styles: 'app/styles/**.scss',
    entry: 'app/index.js',
    dist: 'dist/',
    get distScripts () { return this.assets + 'js/'; },
    get distStyles () { return this.assets + 'css/'; },
    sourceFiles: './app/**/*.js',
    watch: ['**.js', 'styles/**.scss'].map(function (path) {
        return 'app/' + path;
    })
};

gulp.task('styles', function() {
    return gulp.src(pathTo.styles)
        .pipe(plugins.sass({
            includePaths: require('node-bourbon').includePaths
        }))
        .pipe(plugins.rename('ouija.css'))
        .pipe(gulp.dest(pathTo.dist))
        .pipe(plugins.minifyCss({ keepBreaks:true }))
        .pipe(plugins.rename('ouija.min.css'))
        .pipe(gulp.dest(pathTo.dist));
});

gulp.task('scripts', function() {
    return gulp.src(pathTo.entry)
        .pipe(plugins.browserify({
            insertGlobals : false,
            debug: false
        }))
        .pipe(plugins.rename('ouija.js'))
        .pipe(gulp.dest(pathTo.dist))
        .pipe(plugins.uglify({ mangle: false }))
        .pipe(plugins.rename('ouija.min.js'))
        .pipe(gulp.dest(pathTo.dist));
});

gulp.task('build', ['clean', 'styles', 'scripts']);

gulp.task('develop', ['sass'], function () {
    gulp.src(pathTo.entry)
        .pipe(plugins.browserify({
            insertGlobals : false,
            debug: !process.env.NODE_ENV
        }))
        .pipe(plugins.rename('ouija.js'))
        .pipe(gulp.dest(pathTo.distScripts));
});

gulp.task('sass', function () {
    gulp.src(pathTo.styles)
        .pipe(plugins.sass({
            errLogToConsole: true,
            sourceComments: 'none',
            includePaths: require('node-bourbon').includePaths
        }))
        .pipe(plugins.rename('ouija.css'))
        .pipe(gulp.dest(pathTo.distStyles));
});

gulp.task('lint', function () {
    return gulp.src(pathTo.sourceFiles)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('jshint-stylish'))
        .pipe(plugins.jshint.reporter('fail'));
});

gulp.task('test', ['lint']);

// Run the develop task when a file change changes
gulp.task('default', ['develop'], function () {
    gulp.watch(pathTo.watch).on('change', function () {
        gulp.start('develop');
    });
});

gulp.task('clean', function() {
    return gulp.src([pathTo.dist], { read: false })
        .pipe(plugins.clean());
});

gulp.task('deploy', ['publish'], function(cb) {
    if (!GLOBALS.env) {
        return;
    }

    var hipchat = new Hipchat(HIPCHAT_TOKEN);

    var vars = {
        account: ACCOUNT,
        repo: REPO,
        cdn: 'https://' + GLOBALS.bucket + GLOBALS.cdnVersion,
        tag: TAG,
        latest: GLOBALS.isLatest ? '/latest' : null,
        env: GLOBALS.env
    };

    var params = {
        from: 'Travis CI',
        message: _.template(TEMPLATE, vars),
        color: 'purple'
    };

    var tasks = [];

    _.each(HIPCHAT_ROOMS, function(room) {
        var newParams = _.clone(params);

        newParams.room = room;
        tasks.push(_.bind(hipchat.postMessage, hipchat, newParams));
    });

    async.parallel(tasks, function(err, results) {
        err = null; // hipchat api callback signature doesn't include the err

        _.each(results, function(result) {
            if (result && result.status !== 'sent') {
                err = new Error('Error: ' + ERROR_HC);

                return false;
            }
        });

        cb(err);
    });
});

gulp.task('publish', ['globals', 'build'], function() {
    if (!GLOBALS.env) {
        throw new Error('Error: ' + ERROR_ENV);
    }

    if (!TAG) {
        throw new Error('Error: ' + ERROR_NO_TAG);
    }

    var publisher = plugins.awspublish.create({
        key: AWS_S3_ID,
        secret: AWS_S3_SECRET,
        bucket: GLOBALS.bucket
    });

    return gulp.src(pathTo.dist + '*')
        .pipe(plugins.rename(function(path) {
            path.dirname = GLOBALS.cdnVersion;
        }))
        .pipe(publisher.publish())
        .pipe(plugins.notify({ message: 'Deployed ' + TAG + ' to ' + GLOBALS.env }))
        .pipe(gulp.src(pathTo.dist + '*')) // awspublish confused using existing stream
        .pipe(plugins.ifElse(GLOBALS.isLatest, function() {
            return plugins.rename(function(path) { path.dirname = GLOBALS.cdnLatest; });
        }))
        .pipe(plugins.ifElse(GLOBALS.isLatest, function() {
            return publisher.publish();
        }))
        .pipe(plugins.ifElse(GLOBALS.isLatest, function() {
            return plugins.notify({ message: 'Deployed ' + LATEST + ' to ' + GLOBALS.env });
        }));
});

function isLatest(cb) {
    var opts = {
        version: '3.0.0',
        timeout: 5000
    };

    var github = new GitHubApi(opts);

    github.repos.getTags({user: ACCOUNT, repo: REPO }, function (err, tags) {
        if (err) {
            return cb(err);
        }

        tags = _.flatten(tags, 'name');
        tags = tags.sort(semver.rcompare);

        console.log('Tags List: \n', tags, '\n\nCurrent Tag: \n', TAG);

        var latest = tags[0];
        var result = TAG === latest ? true : false;

        cb(null, result);
    });
}

gulp.task('globals', function(cb) {
    var prod = plugins.util.env.production;
    var staging = plugins.util.env.staging;

    var tagDeploy = (TAG && TAG.match(STAGING_REGEX)) ? 'staging': 'production';

    GLOBALS.env = staging ? 'staging' : (prod) ? 'production' : tagDeploy;
    GLOBALS.bucket = GLOBALS.env === 'production' ? BUCKET_PROD : BUCKET_STAGING;

    GLOBALS.cdnVersion = '/' + NAMESPACE + '/' + REPO + '/' + TAG + '/';
    GLOBALS.cdnLatest = '/' + NAMESPACE + '/' + REPO + '/' + LATEST + '/';

    isLatest(function(err, isLatest) {
        if (err) {
            throw err;
        }

        GLOBALS.isLatest = isLatest;

        cb();
    });
});
