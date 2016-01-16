/**
 * Minify files with UglifyJS.
 *
 * ---------------------------------------------------------------
 *
 * Minifies client-side javascript `assets`.
 *
 * For usage docs see:
 * 		https://github.com/gruntjs/grunt-contrib-uglify
 *
 */
module.exports = function(grunt) {
	var files = [
		'src/*.js'
	];

	grunt.config.set('uglify', {
		'pre': {
			'options': {
				'mangle': false,
				'beautify': true,
				'compress': false
			},
			'files': {
				'dist/pre.js': files
			}
		},
		'dev': {
			'options': {
				'mangle': false,
				'beautify': true,
				'compress': false
			},
			'files': {
				'dist/main.js': ['dist/pre.js']
			}
		},
		'prod': {
			'options': {
				'mangle': false,
				'beautify': false
			},
			'files': {
				'dist/main.min.js': ['dist/pre.js']
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
};