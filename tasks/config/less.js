/**
 * Compiles LESS files into CSS.
 *
 * ---------------------------------------------------------------
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-less
 */
module.exports = function(grunt) {
	grunt.config.set('less', {
		'dev': {
			'options': {
				'compress': false,
				'cleancss': true
			},
			'files': [{
				'src': 'src/main.less',
				'dest': 'dist/main.css'
			}]
		},
		'prod': {
			'options': {
				'compress': true,
				'cleancss': true
			},
			'files': [{
				'src': 'src/main.less',
				'dest': 'dist/main.min.css'
			}]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
};
