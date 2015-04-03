var gulp = require('gulp');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var sass = require('gulp-sass');
var karma = require('gulp-karma');

var paths = {
    scripts: ['./src/**/*.coffee'],
    test_coffee: ['./spec/**/*.coffee'],
    karma: [
        'bower_components/jquery/dist/jquery.js',
        'bower_components/angular/angular.js',
        'bower_components/angular-resource/angular-resource.js',
        'bower_components/angular-cookies/angular-cookies.js',
        'bower_components/angular-route/angular-route.js',
        'bower_components/angular-mocks/angular-mocks.js',
        'sw-angular-auth.js',
        './spec/unit/**/*.js'
    ]
};

gulp.task('coffee', function() {
    gulp.src(paths.scripts)
        .pipe(sourcemaps.init())
        .pipe(coffee().on('error', gutil.log))
        .pipe(concat('sw-angular-auth.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./'));
});

gulp.task('compress', function() {
    gulp.src('./sw-angular-auth.js')
        .pipe(uglify({
            mangle: false
        }))
        .pipe(rename('sw-angular-auth.min.js'))
        .pipe(gulp.dest('./'))
});

gulp.task('watch', function() {
    gulp.watch(paths.scripts, ['coffee']);
});

gulp.task('default', ['coffee', 'compress']);



gulp.task('test_coffee', function() {
    gulp.src(paths.test_coffee)
        .pipe(coffee().on('error', gutil.log))
        .pipe(gulp.dest('./spec'));

});

gulp.task('karma', function() {
    gulp.src(paths.karma)
        .pipe(karma({
            configFile: 'karma.conf.js',
            action: 'run'
        }).on('error', gutil.log))
});

gulp.task('test', ['test_coffee', 'karma']);
