var prependFile = require('prepend-file');
var fs = require('fs');

module.exports = function(grunt) {
	
	grunt.config.set('wrap', {
		'all': {
			'files': {
				'irr': ['dist/pre.js']
			}
		}
	});

	grunt.registerMultiTask('wrap', 'Wraps file with closure',
		function() {
			var wrap = {
				'top': [
					'(function(window, angular, undefined) {',
					'\'use strict\';'
				],
				'bottom': [
					'})(window, window.angular);'
				]
			};

			var src = this.files[0].orig.src[0];

			var top = wrap.top.reverse();
			for(var i in top) {
				prependFile.sync(src, top[i]);
			}

			for(var i in wrap.bottom) {
				fs.appendFileSync(src, wrap.bottom[i]);
			}
		}
	);

};