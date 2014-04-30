/* jshint node:true */

'use strict';

var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');
var plugins = gulpLoadPlugins();

var pathTo = {
  styles: 'app/styles/**.scss',
  entry: 'app/index.js',
  watch: ['app/**.js', 'app/**.jsx', 'app/components/**.jsx', 'app/styles/**.scss'],
  casperThemeJs: '../../themes/casper/assets/js/',
  casperThemeCss: '../../themes/casper/assets/css/'
};

// Compile ES6 modules and drop them into the Capser theme directory
gulp.task('develop', ['sass'], function() {
  gulp.src(pathTo.entry)
    .pipe(plugins.browserify({
      insertGlobals : false,
      debug: !gulp.env.production,
      transform: ['hbsfy', 'reactify'],
      extensions: '.jsx'
    }))
    .pipe(plugins.rename('ouija.js'))
    .pipe(gulp.dest(pathTo.casperThemeJs));
});

gulp.task('sass', function () {
  gulp.src(pathTo.styles)
    .pipe(plugins.sass({
      errLogToConsole: true,
      sourceComments: 'map',
      includePaths: require('node-bourbon').includePaths
    }))
    .pipe(plugins.rename('ouija.css'))
    .pipe(gulp.dest(pathTo.casperThemeCss));
});

// Run the develop task when a file change changes
gulp.task('default', ['develop'], function() {
  gulp.watch(pathTo.watch).on('change', function() {
    gulp.start('develop');
  });
});
