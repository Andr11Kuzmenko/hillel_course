import gulp from 'gulp';
import gulpSass from 'gulp-sass';
import * as dartSass from 'sass';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import browserSyncLib from 'browser-sync';
import { deleteAsync } from 'del';

const sass = gulpSass(dartSass);
const browserSync = browserSyncLib.create();

const paths = {
  scss: {
    src: 'src/scss/**/*.scss',
    entry: 'src/scss/main.scss',
    dest: 'dist/css',
  },
  html: {
    src: 'src/*.html',
    dest: 'dist',
  },
  assets: {
    src: 'src/assets/**/*',
    dest: 'dist/assets',
  },
};

export const clean = () => deleteAsync(['dist']);

export function styles() {
  return gulp
    .src(paths.scss.entry)
    .pipe(sourcemaps.init())
    .pipe(sass.sync({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(browserSync.stream({ match: '**/*.css' }));
}

export function stylesMin() {
  return gulp
    .src(paths.scss.entry)
    .pipe(sass.sync({ outputStyle: 'expanded' }).on('error', sass.logError))
    .pipe(autoprefixer({ cascade: false }))
    .pipe(cleanCSS({ level: 2 }))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.scss.dest));
}

export function html() {
  return gulp.src(paths.html.src).pipe(gulp.dest(paths.html.dest));
}

export function assets() {
  return gulp
    .src(paths.assets.src, { allowEmpty: true, encoding: false })
    .pipe(gulp.dest(paths.assets.dest));
}

export function serve() {
  browserSync.init({
    server: { baseDir: 'dist' },
    open: false,
    notify: false,
  });

  gulp.watch(paths.scss.src, styles);
  gulp.watch(paths.html.src, gulp.series(html, reload));
  gulp.watch(paths.assets.src, gulp.series(assets, reload));
}

function reload(done) {
  browserSync.reload();
  done();
}

export const build = gulp.series(
  clean,
  gulp.parallel(styles, stylesMin, html, assets)
);

export default gulp.series(build, serve);
