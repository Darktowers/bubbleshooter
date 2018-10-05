var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
let babel = require('gulp-babel');
var babelminify = require('gulp-babel-minify');
//script paths
var jsFiles = 'src/js/**/*.js',
    jsDest = 'integracion/game';
var files = [
    'src/js/configs/bootstrap.js',
    'src/js/configs/viewport.js',
    'src/js/configs/utils.js',
    'src/js/components/background.js',
    'src/js/components/board.js',
    'src/js/components/bubble.js',
    'src/js/components/shooter.js',
    'src/js/components/player.js',
    'src/js/components/collision.js',
    'src/js/components/ui.js',
    'src/js/ai/ai.js',
    'src/js/states/game.js',
    'src/js/states/menu.js',
    'src/js/states/preloader.js',
    'src/js/states/boot.js',
    'src/js/states/ranking.js',

    'src/js/run.js'
];
gulp.task('scripts', function () {
    return gulp.src(files)

        .pipe(concat('scripts.js'))
        .pipe(babel({
            presets: ['es2016']
        }))
        .pipe(gulp.dest(jsDest))
        .pipe(rename('scripts.min.js'))
        .pipe(babelminify())
        .pipe(gulp.dest(jsDest));
});