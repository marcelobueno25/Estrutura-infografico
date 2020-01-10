// GULP
// Version: 4.0.2

var gulp = require('gulp');
/*************** Global ***************/
var rename = require('gulp-rename');
/*************** HTML ***************/
var handlebars = require('gulp-compile-handlebars');
/*************** JS ***************/
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
/*************** CSS ***************/
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var pxtorem = require('postcss-pxtorem');
/*************** Paths ***************/
var paths = require('./gulp.paths.json');



//===============================================
//                               Stylesheet | CSS
//===============================================
gulp.task('css', async function() {
    var processors = [
        pxtorem({
            replace: true
        })
    ];
    gulp.src(paths.src.css.root)
        .pipe(sass({ outputStyle: 'compressed' }).on('error: ', sass.logError))
        .pipe(postcss(processors))
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest(paths.dest.css.root));
});


gulp.task('js', async function() {
    gulp.src(paths.src.js.lib.all)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dest.js.root));
    gulp.src(paths.src.js.all)
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(paths.dest.js.root));
});


gulp.task('sendXsdXml', async function() {
    gulp.src('./src/xsd-xml/*.xml')
        .pipe(gulp.dest(paths.dest.root));
    gulp.src('./src/xsd-xml/*.xsd')
        .pipe(gulp.dest(paths.dest.root));
});

gulp.task('sendImages', async function() {
    gulp.src('./src/image/*.png')
        .pipe(gulp.dest(paths.dest.img.root));
    gulp.src('./src/image/*.jpg')
        .pipe(gulp.dest(paths.dest.img.root));
});

gulp.task('compileHtml', async function() {
    var templateData = {},
        options = {
            batch: ['./src/pages/templates'],
            helpers: {}
        }
    gulp.src('./src/pages/pai.hbs')
        .pipe(handlebars(templateData, options))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(paths.dest.root));
});


gulp.task('watch', function() {
    gulp.watch((paths.src.css.root, paths.src.css.all), gulp.series('css'));
    gulp.watch(('./src/pages/*.hbs', './src/pages/**/*.hbs'), gulp.series('compileHtml'));
    gulp.watch((paths.src.js.all, paths.src.js.lib.all), gulp.series('js'));
    gulp.watch(('./src/image/*.jpg'), gulp.series('sendImages'));
});

gulp.task('default', gulp.series('compileHtml', 'sendXsdXml', 'sendImages', 'js', 'css', 'watch'))