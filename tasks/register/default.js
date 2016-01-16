module.exports = function (grunt) {
	grunt.registerTask('default', [
		'clean:dist',
		'uglify:pre',
		'wrap:all',
		'uglify:dev',
		'uglify:prod',
		'less:dev',
		'less:prod',
		'clean:done'
	]);
};