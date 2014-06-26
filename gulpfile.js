/* jshint node:true */

var gulp = require('gulp'),
    gutil = require('gulp-util'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    minifyCss = require('gulp-minify-css'),
    plugins = gulpLoadPlugins(),
    config = {},
    pathTo;

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
    get distScripts () { return this.assets + 'js/' },
    get distStyles () { return this.assets + 'css/' },
    sourceFiles: './app/**/*.js',
    watch: ['**.js', 'styles/**.scss'].map(function (path) {
        return 'app/' + path;
    })
};

gulp.task('build', function () {
    gulp.src(pathTo.styles)
        .pipe(plugins.sass({
            includePaths: require('node-bourbon').includePaths
        }))
        .pipe(plugins.rename('ouija.css'))
        .pipe(gulp.dest(pathTo.dist))
        .pipe(minifyCss({ keepBreaks:true }))
        .pipe(plugins.rename('ouija.min.css'))
        .pipe(gulp.dest(pathTo.dist));

    gulp.src(pathTo.entry)
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
