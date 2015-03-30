module.exports = function (grunt) {
	// Project configuration.
	grunt.initConfig({
		// backend linter
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			appfiles: {
				src: [
					'Gruntfile.js',
					'package.json',
					'app/scripts/*.js'
				]
			}
		},
		// move files from client and into dist
		copy: {
			dist: {
				cwd: 'app',
				src: [ '**' ],
				dest: 'dist',
				expand: true
			}
		},
		// clean(deletes) the dist folder
		clean: {
			dist: {
				src: 'dist'
			},
			styles: {
				src: [
					'dist/styles/*.css',
					'!dist/styles/app.css'
				]
			},
			scripts: {
				src: [
					'dist/scripts/*.js',
					'!dist/scripts/app.js'
				]
			}
		},
		// minifies CSS
		cssmin: {
			dist: {
				files: {
					'dist/styles/app.css': 'app/styles/*.css'
				}
			}
		},
		// minifies JS
		uglify: {
			dist: {
				options: {
					mangle: false
				},
				files: {
					'dist/scripts/app.js': 'app/scripts/*.js'
				}
			}
		},
		// http server
		'http-server': {
			'dev': {
				// the server root directory
				root: './app',
				port: 8080,
				host: '127.0.0.1',
				// server default file extension
				ext: 'html',
				// run in parallel with other tasks
				runInBackground: false
			},
			'prod': {
				// the server root directory
				root: './dist',
				port: 8080,
				host: '127.0.0.1',
				// server default file extension
				ext: 'html',
				// run in parallel with other tasks
				runInBackground: false
			}
		},
		// build control for updating gh-pages with dist
		buildcontrol: {
			options: {
				dir: 'dist',
				commit: true,
				push: true,
				message: 'Syncing gh-pages with master.'
			},
			pages: {
				options: {
					remote: 'omg',
					remote: 'git@github.com:jshemas/passwordGenerator.git',
					branch: 'gh-pages'
				}
			},
		},
		// live watcher for file changes
		watch: {
			dev: {
				files: [
					'Gruntfile.js',
					'package.json',
					'app/scripts/*.js',
					'app/styles/*.css',
					'app/views/*.html',
					'app/*.html'
				],
				tasks: [
					'http-server:dev:stop',
					'jshint:gruntfile',
					'http-server:dev:start'
				]
			},
			prod: {
				files: [
					'Gruntfile.js',
					'package.json',
					'app/scripts/*.js',
					'app/styles/*.css',
					'app/views/*.html',
					'app/*.html'
				],
				tasks: [
					'http-server:prod:stop',
					'jshint:gruntfile',
					'build',
					'http-server:prod:start'
				]
			}
		}
	});
	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-http-server');
	grunt.loadNpmTasks('grunt-build-control');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	// Tasks.
	grunt.registerTask('default', ['jshint', 'http-server:dev:start', 'watch:dev']);
	grunt.registerTask('build', ['clean:dist', 'copy', 'cssmin', 'uglify', 'clean:styles', 'clean:scripts']);
	grunt.registerTask('prod', ['jshint', 'build', 'http-server:prod:start', 'watch:prod']);
	grunt.registerTask('push', ['build', 'buildcontrol:pages']);
};