var gulp = require("gulp");
var exec = require('child_process').exec;
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

var gutil = require("gulp-util");
var sass = require("gulp-sass");

var browserify = require('browserify');
var babelify = require('babelify');
var watchify = require('watchify');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

var run = (command) => {
  exec(command, function (err, stdout, stderr) {
    console.info(stdout);
    console.info(stderr);
  });
};

var compileStyles = () => {
  return gulp.src("./src/sass/*.scss")
    .pipe(sass().on("error", sass.logError))
    .pipe(gulp.dest("./src/css/"));
};
var watchStyles = () => {
  gulp.watch("src/sass/*.scss", compileStyles );
};

var watchJs = false;
var turnOnWatcher = (done) => {
  watchJs = true;
  done();
};
var compileJs = () => {
  var bundle = browserify({
      entries: './src/js/main.js',
      debug: true
    })
    .exclude("jquery")
    .exclude("src/js/libs.js")
    .transform(babelify, { presets: ['env', 'es2015'] })
    .transform({ global: true }, 'browserify-shim');

  let bundler = () => {
    console.info("compiling JS...");
    return bundle.bundle()
        .on("error", (err) => { 
          console.info(err.toString());
        })
      .pipe(source("bundle.js"))
      .pipe(buffer())
      .pipe(sourcemaps.init({loadMaps: true}))
      .pipe(sourcemaps.write('./'))
      .pipe(gulp.dest("./"));
  };

  console.info("watching? ", watchJs);
  if(watchJs) {
    bundle = watchify(bundle);
    bundle.on("update", bundler);
    bundle.on("error", gutil.log);
  }

  return bundler();
};
var buildJs = () => {
  var bundle = browserify({
      entries: './src/js/main.js'
    })
    .exclude("jquery")
    .exclude("src/js/libs.js")
    .transform(babelify, { presets: ['env', 'es2015', 'minify'] });

  return bundle.bundle()
    .pipe(source("bundle.js"))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest("./"));
};

var runServer = () => {
  run("http-server");
  console.info("Starting up http-server on : 127.0.0.1:8080");
};


gulp.task("styles", gulp.series(compileStyles) );
gulp.task("scripts", gulp.series(compileJs) );
gulp.task("build", gulp.series(buildJs, compileStyles));
gulp.task("dev-run", gulp.series(turnOnWatcher, compileJs, compileStyles, runServer));

gulp.task("default", gulp.series("dev-run"));

