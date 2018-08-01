var gulp         = require('gulp');
var path         = require('path');
var del          = require('del');
var changed      = require('gulp-changed');
var notify       = require("gulp-notify");
var autoprefixer = require('gulp-autoprefixer');
var plumber      = require('gulp-plumber');
var sequence     = require('gulp-sequence');
var connect      = require('gulp-connect');
var jasmine      = require('gulp-jasmine');

var srcPath   = './';
var distPath  = './';

var commonErrorOpt = {
    errorHandler: notify.onError("Error: <%= error.message %>")
};

/* delete */
function delSync( event ){
    if ( event.type === 'deleted' ){
        var filePathFromSrc = path.relative(path.resolve('src'), event.path);
        var destFilePath    = path.resolve('build', filePathFromSrc.replace('\\app','\\app\\dist'));
        del.sync(destFilePath);
    }
}


gulp.task('task:spec', function(){
    var src = srcPath + '/**.spec.js';

    return gulp.src(src)
        .pipe(plumber(commonErrorOpt))
        .pipe(jasmine({errorOnFail: false}))
        .pipe(plumber.stop());
});

gulp.task('task:connect', function(){
    connect.server({
        root       : distPath,
        port       : 8001,
        livereload : true
    });
});

gulp.task('task:watcher', function(){
    var watchers = [];

    watchers.push( gulp.watch([srcPath + '/**'], { interval: 500 }, ['task:spec']));
    
    watchers.forEach( function(watcher, idx){        
        watcher.on('change', delSync);
    });
});

gulp.task('default', sequence('task:spec', 'task:connect', 'task:watcher'));