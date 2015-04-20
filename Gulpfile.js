'use strict';

var gulp = require('gulp');
var gutil = require('gulp-util');
var open = require('gulp-open');
var clean = require('gulp-clean');
var webpack = require('webpack');
var gwebpack = require('gulp-webpack');
var WebpackDevServer = require("webpack-dev-server");

var eslint= require('gulp-eslint');
var karma = require('karma').server;

var webpackDistConfig = require('./webpack.dist.config.js'),
    webpackDevConfig = require('./webpack.config.js');

gulp.task('open', function(){
  gulp.src('./demo/index.html')
  .pipe(open('',{url: 'http://localhost:8080/webpack-dev-server/'}));
});

gulp.task('clean', function(){
  return gulp.src('dist', {read: false})
    .pipe(clean());
});

gulp.task("webpack", ['clean'], function() {
  return gulp.src('index.js')
    .pipe(gwebpack(webpackDistConfig))
    .pipe(gulp.dest('dist/'));
});

gulp.task("webpack-dev-server", function(callback) {

  new WebpackDevServer(webpack(webpackDevConfig), {
    publicPath: "/assets/",
    contentBase: "demo",
    stats: {
      colors: true
    }
  }).listen(8080, "localhost", function(err) {
    if(err) throw new gutil.PluginError("webpack-dev-server", err);
  });

});

gulp.task('lint', function () {
  return gulp.src(['src/**/*.js'])
    .pipe(eslint())
    .pipe(eslint.format())
});


gulp.task("karma", ['lint'], function() {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  });
});

gulp.task('test', ['lint', 'karma']);
gulp.task('build', ['clean', 'webpack']);
gulp.task('default', ['webpack-dev-server', 'open']);
