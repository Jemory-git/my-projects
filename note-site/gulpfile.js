var gulp = require('gulp');
var gulpIf = require('gulp-if');
var autoprefixer = require('gulp-autoprefixer');
var cleanCss = require('gulp-clean-css');
var minifyHtml = require('gulp-html-minify');
var imagemin = require('gulp-imagemin');
var uglify = require('gulp-uglify');//压缩js

gulp.task('front',function(){
    gulp.src("./photo-front/**/*")
        .pipe(gulpIf('*.css',autoprefixer()))
        .pipe(gulpIf('*.css',cleanCss()))
        .pipe(gulpIf('*.png',imagemin()))
        .pipe(gulpIf('*.html',minifyHtml()))
        .pipe(gulpIf('*.js',uglify()))
        .pipe(gulp.dest('./min-front'))
});
gulp.task('default', ['front']);

//压缩修改后的单个css文件
// gulp.task('front',function(){
//     gulp.src("./photo-front/css/index.css")
//         .pipe(autoprefixer())
//         .pipe(minifyCss())
//         .pipe(gulp.dest('./index.min.css'))
// });
// gulp.task('default', ['front']);