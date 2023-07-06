const {series, src, dest, watch, parallel} = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const concat = require('gulp-concat');

const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const cssnano = require('cssnano');
const sourcemaps = require('gulp-sourcemaps');

const terser = require('gulp-terser-js');



function css(){
    return src('src/scss/app.scss')
    .pipe(sourcemaps.init() )
        .pipe( sass() )  
        .pipe(postcss([autoprefixer(), cssnano()]) )
        .pipe( sourcemaps.write('.'))
        .pipe( dest('./build/css')) 
}


 function javascript(){
    return src('src/js/**/*.js')
        .pipe( sourcemaps.init() )
        .pipe( concat('bundle.js') )
        .pipe( terser())
        .pipe( sourcemaps.write('.'))
        .pipe( dest('./build/js'))
}


function watchArchivos(){ 
    watch('src/scss/**/*.scss' , css)  
    watch('src/js/**/*.js' , javascript)
} 


exports.css = css;
exports.javascript = javascript;
exports.watchArchivos = watchArchivos;

exports.default = series(css, javascript, watchArchivos)

