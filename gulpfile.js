var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var connect = require('gulp-connect');
//var compass = require('gulp-compass');

gulp.task('webserver', function() {
  connect.server({
    livereload: true
  });
});
// gulp.task('compass', function() {
//   gulp.src('./scss/**/*.scss')
//     .pipe(compass({
//       //  css: 'www/css',
//       // sass: 'scss',
//       // image: 'www/img'
//       config_file: './config.rb',
//       // project: path.join(__dirname, 'assets'),
//       // css: 'stylesheets',
//       sass: 'sass'
//     }))
//     .pipe(gulp.dest('app/assets/temp'));
// });
gulp.task('default', ['webserver', 'sass'], function(argument) {
  //gulp.start('compass');
  gulp.start('watch');
});

var paths = {
  sass: ['scss/**/*.scss'],
  js: ['www/js/*.js'],
  html: ['./www/**/*.html']
};

//gulp.task('default', ['sass']);

gulp.task('sass', function(done) {
  gutil.log('sass changes');
  gulp.src('./scss/**/*.scss')
    .pipe(sass(
    {
          compass: false,
          errLogToConsole: true
       }
       ))
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({
      extname: '.min.css'
    }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('js', function(argument) {
  return gutil.log('js changes')
})

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.js, function(argument) {
    gutil.log('js changes 2');
  });
  // gulp.watch(paths.html, [],function (argument) {
  //    return gutil.log('html changes')
  // });
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});