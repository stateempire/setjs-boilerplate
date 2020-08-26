var gulp = require('gulp');
// var pug = require('gulp-pug');
var fileinclude = require('gulp-file-include');
var replace = require('gulp-replace');
var plumber = require('gulp-plumber');
var {paths, settings} = require('../setup.js');

// function pugViews() {
//   return gulp.src(paths.src.views + '/page/**/*.pug')
//     .pipe(plumber())
//     .pipe(pug({
//       basedir: paths.src.views,
//       data: settings,
//     }))
//     .pipe(gulp.dest(paths.dest.base));
// }

function htmlViews() {
  return gulp.src(paths.src.views + '/page/**/*.html')
    .pipe(plumber())
    .pipe(fileinclude({
      prefix: '@@',
      basepath: paths.src.views
    }))
    .pipe(replace(/@replace{([^{}]*)}/g, function(match, group1) {
      if (group1 in settings) {
        return settings[group1];
      }
      return match;
    }))
    .pipe(gulp.dest(paths.dest.base));
}

exports.views = gulp.parallel(
  htmlViews,
  // pugViews,
);
