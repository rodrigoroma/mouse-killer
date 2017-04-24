var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

var file = "./src/mouse-killer.js";

gulp.task('dist', function () {

	gulp.src(file)
		.pipe(gulp.dest('./docs'))
		.pipe(gulp.dest('./dist'))
		.pipe(uglify({
			preserveComments: 'license'
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('./dist'));
});

gulp.task('default', ['dist'], function () {
	gulp.watch(file, ['dist']);
});
