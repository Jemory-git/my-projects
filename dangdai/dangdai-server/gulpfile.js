var gulp = require('gulp');
var gulpIf = require('gulp-if');
var minifyCss = require('gulp-minify-css');
var imagemin = require('gulp-imagemin');
var autoprefixer = require('gulp-autoprefixer');
var handlebars = require('gulp-handlebars');

gulp.task('cssprefix',function(){
    gulp.src("../dangdai-mall/**/*",{base: '../'})
        .pipe(gulpIf('*.css',minifyCss()))
        .pipe(gulpIf('*.+(png | jpg | gif)',imagemin()))
        .pipe(gulp.dest('../gulp-test'))
});
gulp.task('default', ['cssprefix']);