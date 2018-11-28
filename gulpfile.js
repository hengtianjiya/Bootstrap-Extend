const gulp = require('gulp');
const replace = require('gulp-replace');
const defaultConfig = require('./config.js').config;

// 引入组件
const imagemin = require('gulp-imagemin');//图片压缩
const minifycss = require('gulp-clean-css');//css压缩
const less = require('gulp-less');//解less
const LessPluginAutoPrefix = require('less-plugin-autoprefix');
const autoprefixer = new LessPluginAutoPrefix();
const sourcemaps = require('gulp-sourcemaps');//添加map
const rename = require('gulp-rename');//文件更名
const notify = require('gulp-notify');//提示信息
const del = require('del');
const plumber = require('gulp-plumber');

var TIME_STAMP = new Date().getTime();

// 清理生产目录文件
gulp.task('clean', function (cb) {
    del([
        `${defaultConfig.cssDistPath}/*.css`,
        `${defaultConfig.cssDistPath}/*.map`,
        `${defaultConfig.imgDistPath}/*.png`,
        `${defaultConfig.imgDistPath}/*.jpg`,
        `${defaultConfig.imgDistPath}/*.gif`,
        `${defaultConfig.htmlDistPath}/*.html`
    ]).then(paths => {
        console.log('Deleted files and folders:\n', paths.join('\n'));
        cb();
    });
});

gulp.task('devrp', function () {
    return gulp.src([`${defaultConfig.htmlSrcPath}/*.html`])
        .pipe(replace(defaultConfig.proPath, defaultConfig.devPath))
        .pipe(gulp.dest(`${defaultConfig.htmlDistPath}/`))
        .pipe(notify({ message: `${defaultConfig.htmlSrcPath}/*.html` }));
});

gulp.task('prorp', function () {
    return gulp.src([`${defaultConfig.htmlSrcPath}/*.html`])
        .pipe(replace(defaultConfig.devPath, defaultConfig.proPath))
        .pipe(replace(defaultConfig.buildCssFileReg, `$1$2/$3_${TIME_STAMP}.$4`))
        .pipe(replace(defaultConfig.buildJsFileReg, `$1$2/$3.$4?${TIME_STAMP}`))
        .pipe(gulp.dest(`${defaultConfig.htmlDistPath}/`))
        .pipe(notify({ message: `${defaultConfig.htmlSrcPath}/*.html` }));
});

// 压缩图片
gulp.task('img', function () {
    return gulp.src([`${defaultConfig.imgSrcPath}/**`])
        .pipe(imagemin({
            optimizationLevel: 5, //类型：Number  默认：3  取值范围：0-7（优化等级）
            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
            multipass: true //类型：Boolean 默认：false 多次优化svg直到完全优化
        }))
        .pipe(gulp.dest(defaultConfig.imgDistPath))
        .pipe(notify({ message: 'img task ok' }));
});

// 合并、压缩、重命名less
gulp.task('devless', function () {
    return gulp.src(`${defaultConfig.cssSrcPath}/*.less`)
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(less({
            plugins: [autoprefixer]
        }))
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(`${defaultConfig.cssDistPath}/`))
        .pipe(notify({ message: 'less task ok' }));
});

gulp.task('proless', function () {
    return gulp.src(`${defaultConfig.cssSrcPath}/*.less`)
        .pipe(rename({ suffix: '_' + TIME_STAMP }))
        .pipe(plumber({
            errorHandler: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sourcemaps.init())
        .pipe(less({
            plugins: [autoprefixer]
        }))
        .pipe(sourcemaps.write('/'))
        .pipe(gulp.dest(`${defaultConfig.cssDistPath}/`))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss({
            processImport: false
        }))
        .pipe(gulp.dest(`${defaultConfig.cssDistPath}/`))
        .pipe(notify({ message: 'less task ok' }));
});

if (process.env.NODE_ENV === 'development') {
    var tasks = ['clean', 'devless', 'img', 'devrp'];
} else {
    var tasks = ['clean', 'proless', 'img', 'prorp'];
}

gulp.task('default', tasks, function () {
    if (process.env.NODE_ENV !== 'development') return false;
    // Watch .css files
    gulp.watch(`${defaultConfig.cssSrcPath}/*.less`, ['devless']);
    // Watch image files
    gulp.watch(`${defaultConfig.imgSrcPath}/**`, ['img']);

    gulp.watch(`${defaultConfig.htmlSrcPath}/**`, ['devrp']);
});