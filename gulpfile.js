/* jshint node:true */

'use strict';

var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

var pathTo = {
  entry: 'src/index.js',
  watch: 'src/**.js',
  casperTheme: '../../themes/casper/assets/js/'
};

// Compile ES6 modules and drop them into the Capser theme directory
gulp.task('develop', function() {
  gulp.src('src/index.js')
    .pipe(plugins.browserify())
    .pipe(plugins.rename('ouija.js'))
    .pipe(gulp.dest(pathTo.casperTheme));
});

// Run the develop task when a file change changes
gulp.task('default', ['develop'], function() {
  gulp.watch(pathTo.watch).on('change', function() {
    gulp.start('develop');
  });
});
