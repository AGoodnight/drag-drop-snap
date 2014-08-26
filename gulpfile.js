 var gulp = require('gulp'),
    sass = require('gulp-sass'),
    livereload = require('gulp-livereload'),
    watch = require('gulp-watch');

gulp.task('sass', function() {
   gulp.src('scss/*.scss')
      .pipe(watch())
      .pipe(sass())
      .pipe(gulp.dest('css'))
      .pipe(livereload());
});

// Default Task
gulp.task('default', ['sass']);