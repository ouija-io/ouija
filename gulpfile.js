/* jshint node:true */

'use strict';

var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

var pathTo = {
  entry: 'component/index.js',
  watch: ['component/**.js', 'component/templates/**.hbs'],
  casperTheme: '../../themes/casper/assets/js/'
};

// Compile ES6 modules and drop them into the Capser theme directory
gulp.task('develop', function() {
  gulp.src(pathTo.entry)
    .pipe(plugins.browserify({ debug: true, transform: ['hbsfy'] }))
    .pipe(plugins.rename('ouija.js'))
    .pipe(gulp.dest(pathTo.casperTheme));
});

// Run the develop task when a file change changes
gulp.task('default', ['develop'], function() {
  gulp.watch(pathTo.watch).on('change', function() {
    gulp.start('develop');
  });
});
