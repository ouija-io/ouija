/* jshint node:true */

'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpLoadPlugins = require('gulp-load-plugins');
var minifyCss = require('gulp-minify-css');
var plugins = gulpLoadPlugins();
var config = {};

try {
  config = require('./config/ouija.json');
} catch(e) {
  console.log('ouija.json not found in config/');
}

function Paths() {
  this.assets = '../../themes/' + config.theme + '/assets/';
  this.styles = 'app/styles/**.scss';
  this.entry = 'app/index.js';
  this.dist = 'dist/';
  this.distScripts = this.assets + 'js/';
  this.distStyles = this.assets + 'css/';
  this.watch = [
    '**.js',
    '**.jsx',
    'components/**.jsx',
    'styles/**.scss'
  ].map(function(path) {
    return 'app/' + path;
  });
}

var pathTo = new Paths();

gulp.task('build', function() {
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
      debug: false,
      transform: ['reactify'],
      extensions: '.jsx'
    }))
    .pipe(plugins.rename('ouija.js'))
    .pipe(gulp.dest(pathTo.dist))
    .pipe(plugins.uglify({ mangle: false }))
    .pipe(plugins.rename('ouija.min.js'))
    .pipe(gulp.dest(pathTo.dist));
});

gulp.task('develop', ['sass'], function() {
  gulp.src(pathTo.entry)
    .pipe(plugins.browserify({
      insertGlobals : false,
      debug: !gulp.env.production,
      transform: ['reactify'],
      extensions: '.jsx'
    }))
    .pipe(plugins.rename('ouija.js'))
    .pipe(gulp.dest(pathTo.distScripts));
});

gulp.task('sass', function() {
  gulp.src(pathTo.styles)
    .pipe(plugins.sass({
      errLogToConsole: true,
      sourceComments: 'map',
      includePaths: require('node-bourbon').includePaths
    }))
    .pipe(plugins.rename('ouija.css'))
    .pipe(gulp.dest(pathTo.distStyles));
});

gulp.task('lint', function() {
  return gulp.src(['./app/*.js', './app/*.jsx', './deploy/*.js'])
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter('jshint-stylish'))
    .pipe(plugins.jshint.reporter('fail'));
});

// Run the develop task when a file change changes
gulp.task('default', ['develop'], function() {
  gulp.watch(pathTo.watch).on('change', function() {
    gulp.start('develop');
  });
});
