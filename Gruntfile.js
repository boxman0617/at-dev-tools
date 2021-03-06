/**
 * Gruntfile
 *
 * This Node script is executed when you run `grunt [command]`.
 * It's purpose is to load the Grunt tasks in your project's `tasks`
 * folder, and allow you to add and remove tasks as you see fit.
 *
 * WARNING:
 * Unless you know what you're doing, you shouldn't change this file.
 * Check out the `tasks` directory instead.
 */

module.exports = function(grunt) {

	// Load the include-all library in order to require all of our grunt
	// configurations and task registrations dynamically.
	var includeAll;
	try {
		includeAll = require('include-all');
	} catch(e0) {
		console.error('Could not find `include-all` module.');
		console.error('Skipping grunt tasks...');
		console.error('To fix this, please run:');
		console.error('npm install include-all --save-dev');
		console.error();

		grunt.registerTask('default', []);
		return;
	}

	/**
	 * Loads Grunt configuration modules from the specified
	 * relative path. These modules should export a function
	 * that, when run, should either load/configure or register
	 * a Grunt task.
	 */
	function loadTasks(relPath) {
		var files = includeAll({
			'dirname': require('path').resolve(__dirname, relPath),
			'filter': /(.+)\.js$/
		}) || {};

		return files;
	}

	/**
	 * Invokes the function from a Grunt configuration module with
	 * a single argument - the `grunt` object.
	 */
	function invokeConfigFn(tasks) {
		for (var taskName in tasks) {
			if (tasks.hasOwnProperty(taskName)) {
				tasks[taskName](grunt);
			}
		}
	}

	// Load task functions
	var taskConfigurations = loadTasks('./tasks/config'),
		registerDefinitions = loadTasks('./tasks/register');

	// (ensure that a default task exists)
	if (!registerDefinitions.default) {
		registerDefinitions.default = function (grunt) { grunt.registerTask('default', []); };
	}

	// Run task functions to configure Grunt.
	invokeConfigFn(taskConfigurations);
	invokeConfigFn(registerDefinitions);
};