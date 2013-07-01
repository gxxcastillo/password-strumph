
module.exports = function(grunt) {
	'use strict';


	// Project configuration.
	grunt.initConfig({
		meta: {
			version: require('./package.json').version
			, banner: '/**\n * password-strumph.js - v<%= meta.version %> \n' +
				' * Copyright (c) <%= grunt.template.today("yyyy") %> Uglymunky\n' +
				' * \n' +
				' * Refactored from jQuery validate.password plug-in 1.0\n' +
				' * Original Copyright (c) 2009 Jörn Zaefferer\n' +
				' * \n' +
				' * Dual licensed under the MIT and GPL licenses:\n' +
				' * http://www.opensource.org/licenses/mit-license.php\n' +
				' * http://www.gnu.org/licenses/gpl.html\n' +
				' */\n'
		}


		, buster: {
			test: {
				reporter: 'specification'
			}
		}


		, jshint: {
			options: {
				jshintrc: '.jshintrc'
			}
			, all: ['src/**/*.js', 'test/spec/**/*.js']
		}


		, rig: {
			compile: {
				options: {
					banner: '<%= meta.banner %>'
				}
				, files: {
					'dist/amd/strumph.js': ['build/_amd.js']
					, 'dist/strumph.js': ['build/_iife.js']
				}
			}
		}


		, uglify: {
			target: {
				options: {
					banner: '<%= meta.banner %>'
				}
				, files: {
					'dist/strumph.min.js': ['dist/strumph.js']
					, 'dist/amd/strumph.min.js': ['dist/amd/strumph.js']
				}
			}
		}
	});


	grunt.loadNpmTasks('grunt-buster');
	grunt.loadNpmTasks('grunt-rigger');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('test', ['jshint', 'buster']);
	grunt.registerTask('build', ['jshint', 'buster', 'rig', 'uglify']);
};