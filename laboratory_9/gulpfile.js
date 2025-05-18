const { src, dest, series, parallel } = require('gulp');
const concat = require('gulp-concat');
const terser = require('gulp-terser');
const cssnano = require('gulp-cssnano');
const purgecss = require('gulp-purgecss');
const imagemin = require('gulp-imagemin');

function styles() {
    return src([
        'src/css/base.css',
        'src/css/components/*.css'
    ])
    .pipe(concat('styles.min.css'))
    .pipe(purgecss({
        content: ['index.html', 'src/js/**/*.js']
    }))
    .pipe(cssnano())
    .pipe(dest('dist'));
}

function scripts() {
    return src([
        'src/js/utils/*.js',
        'src/js/components/*.js',
        'src/js/main.js'
    ])
    .pipe(concat('main.min.js'))
    .pipe(terser({
        compress: {
            drop_console: true
        }
    }))
    .pipe(dest('dist'));
}

function images() {
    return src('src/images/**/*')
        .pipe(imagemin([
            imagemin.mozjpeg({ quality: 75, progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 }),
            imagemin.svgo({
                plugins: [{ removeViewBox: false }]
            })
        ]))
        .pipe(dest('dist/images'));
}

function criticalCSS() {
    return src('src/css/critical.css')
        .pipe(cssnano())
        .pipe(dest('dist'));
}

function modernizr() {
    return src('src/js/vendor/modernizr.js')
        .pipe(terser())
        .pipe(dest('dist/vendor'));
}

function modules() {
    return src('src/js/modules/*.js')
        .pipe(terser())
        .pipe(dest('dist/modules'));
}

exports.default = parallel(
    series(criticalCSS, styles), 
    series(modernizr, modules, scripts), 
    images
);
