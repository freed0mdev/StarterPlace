var gulp = require('gulp'),
	sass = require('gulp-sass'),
	browserSync = require('browser-sync'),
	jade = require('gulp-jade'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglifyjs'),
	cssnano = require('gulp-cssnano'),
	rename = require('gulp-rename'),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	cache = require('gulp-cache'),
	autoprefixer = require('gulp-autoprefixer');

gulp.task('jade', function(){
	return gulp.src(['app/jade/**/*.jade', '!app/jade/**/_*.jade'])
	.pipe(jade())
	.pipe(gulp.dest('dist'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('sass', function(){
	return gulp.src('app/sass/**/*.sass')
	.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7']))
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('dist/css'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts', function(){
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
	])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist/js'))
	.pipe(browserSync.reload({stream: true}));
});

gulp.task('img', function(){
	return gulp.src('app/img/**/*')
	.pipe(cache(imagemin({
		nterlaced: true,
		progressive: true,
		svgPlugins: [{removeViewBox: false}],
		use: [pngquant()]
	})))
	.pipe(gulp.dest('dist/img'));
});

gulp.task('clean', function() {
	return del.sync('dist');
});

gulp.task('build', ['clean', 'jade', 'sass', 'img', 'scripts'], function(){
	var buildCss = gulp.src([
			'app/css/main.min.css',
			'app/css/fonts.min.css',
			'app/css/libs.min.css'
		])
	.pipe(gulp.dest('dist/css'));

	var buildFonts = gulp.src('app/fonts/**/*')
	.pipe(gulp.dest('dist/fonts'));

	var buildJs = gulp.src('app/js/**/*')
	.pipe(gulp.dest('dist/js'));

	var buildHtml = gulp.src('app/*.html')
	.pipe(gulp.dest('dist'));

});

gulp.task('browser-sync', function(){
	browserSync({
		server: {
			baseDir: './dist'
		},
		notify: false
	});
});

gulp.task('watch', ['browser-sync'], function(){
	gulp.watch('app/sass/**/*.sass', ['sass']);
	gulp.watch('app/jade/**/*.jade', ['jade']);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('default', ['jade', 'sass', 'scripts', 'watch']);

gulp.task('clear', function(){
	return cache.clearAll();
});