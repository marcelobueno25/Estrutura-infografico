// GULP
// Version: 4.0.2

var gulp = require('gulp');
/*************** Global ***************/
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var zip = require('gulp-zip');
var browserSync = require('browser-sync').create();
/*************** HTML ***************/
var fileinclude = require('gulp-file-include');
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
//                                           HTML
//===============================================
gulp.task('html', async function() {
    return gulp.src(paths.src.views.all)
        .pipe(fileinclude({
            prefix: '@@',
            basepath: '@file'
        }))
        .pipe(gulp.dest(paths.dest.root))
});


//===============================================
//                               Stylesheet | CSS
//===============================================
gulp.task('css', async function() {
    var processors = [
        pxtorem({
            replace: true
        })
    ];
    return gulp.src(paths.src.css.root)
        .pipe(sass({ outputStyle: 'compressed' }).on('error: ', sass.logError))
        .pipe(postcss(processors))
        .pipe(rename('style.min.css'))
        .pipe(gulp.dest(paths.dest.css.root));
});


//===============================================
//                                JavaScript | JS
//===============================================
gulp.task('js', async function() {
    return gulp.src([paths.src.js.lib.all, paths.src.js.all])
        .pipe(babel())
        .pipe(uglify())
        .pipe(gulp.dest(paths.dest.js.root));
});


//===============================================
//                                         Images
//===============================================
gulp.task('image', async function() {
    return gulp.src(paths.src.img.all)
        .pipe(gulp.dest(paths.dest.img.root));
});


//===============================================
//                                          SCORM
//===============================================
gulp.task('scorm', async function() {
    return gulp.src(paths.src.scorm.all)
        .pipe(gulp.dest(paths.dest.root));
});


//===============================================
//                                          Fonts
//===============================================
gulp.task('fonts', async function() {
    return gulp.src(paths.src.fonts.all)
        .pipe(gulp.dest(paths.dest.fonts.root))
});

//===============================================
//                                            ZIP
//===============================================
gulp.task('zip', async function() {
    return gulp.src('./dist/**')
        .pipe(zip('infografico.zip'))
        .pipe(gulp.dest(paths.default.root))
});


//===============================================
//                                          Clean
//===============================================
gulp.task('clean', function() {
    return gulp.src(paths.dest.root, { read: false })
        .pipe(clean());
});

//===============================================
//                                          Watch
//===============================================
gulp.task('watch', function() {
    browserSync.init({
        server: { baseDir: paths.dest.root }
    });
    gulp.watch([paths.src.css.root, paths.src.css.all], gulp.series('css', 'browsersync:reload'));
    gulp.watch([paths.src.views.root, paths.src.views.components.all], gulp.series('html', 'browsersync:reload'));
    gulp.watch([paths.src.js.all, paths.src.js.lib.all], gulp.series('js', 'browsersync:reload'));
    gulp.watch((paths.src.img.all), gulp.series('image', 'browsersync:reload'));
})
gulp.task('browsersync:reload', function(done) {
    browserSync.reload();
    done();
})

//===============================================
//                                  Tasks Default
//===============================================
gulp.task('default', gulp.series('html', 'scorm', 'image', 'js', 'css', 'watch'))