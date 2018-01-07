const gulp = require('gulp');
const nodemon = require('gulp-nodemon');

const config = {
	script:'./src/server.js',
	// 忽略部分对程序运行无影响的文件的改动，nodemon只监视js文件，可用ext项来扩展别的文件类型
	ignore:['gulpfile.js','node_modules/'],
	env:{
		'NODE_ENV':'development'//开发模式
		// 'NODE_ENV':'production'//生产模式
	}
};

function callback() {
	console.log('restart express server becuase the JavaScript file changed');
}

gulp.task('dev', function() {
	nodemon(config).on('start', callback);
});
