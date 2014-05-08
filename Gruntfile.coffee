module.exports = (grunt)->
	grunt.initConfig
		pkg: grunt.file.readJSON 'package.json'

		clean:
			first: ['dist']
			final: ['dist/**/*.coffee', 'dist/**/angular-*.js']

		copy:
			base:
				files: [
					{
						expand: true,
						cwd: 'src',
						src: [ 'public/css/**',
									 'public/themes/**',
									 'utility/**/*.js'
									 'data/posts/1.json',
									 'data/comments/1.json',
									 'data/comments/2.json'],
						dest: 'dist/'
					}
				]
			dev:
				files: [
					{
						expand: true,
						cwd: 'src',
						src: ['data/posts/*',
									'data/comments/*'],
						dest: 'dist/'
					}
				]

		coffee:
			frontendCore:
				options:
					join: true
				files:
					'dist/public/js/quartz.js': ['src/public/js/quartz.coffee', 'src/public/js/*/*.coffee']
			themes:
				expand: true,
				cwd: 'src',
				src: ['public/themes/**/*.coffee'],
				dest: 'dist/',
				ext: '.js'
			backend:
				options:
					bare: true
				expand: true,
				cwd: 'src',
				src: ['./*.coffee', 'models/*.coffee', 'dao/*.coffee', 'data/config/*.coffee', 'utility/*.coffee',
							'utility/*/*.coffee'],
				dest: 'dist/',
				ext: '.js'

		bowercopy:
			lib:
				options:
					destPrefix: 'dist/public/js/lib'
				files:
					'angular.js': 'angular/angular.js'
					'angular-resource.js': 'angular-resource/angular-resource.js'
					'angular-route.js': 'angular-route/angular-route.js'
					'angular-sanitize.js': 'angular-sanitize/angular-sanitize.js'
					'ng-infinite-scroll.js': 'ngInfiniteScroll/build/ng-infinite-scroll.js'
					'jquery.js': 'jquery/dist/jquery.js'
					'jquery-migrate.js': 'jquery-migrate/jquery-migrate.js'
					'underscore.js': 'underscore/underscore.js'

		concat:
			angular:
				files:
					'dist/public/js/lib/angular.js': ['dist/public/js/lib/angular.js', 'dist/public/js/lib/angular*.js']

		uglify:
			options:
				preserveComments: false
				mangle: true
			files:
				expand: true
				cwd: 'dist/public'
				src: '**/*.js'
				dest: 'dist/public'

		cssmin:
			minify:
				expand: true
				src: ['dist/**/*.css']
				dest: '.'
				ext: '.css'

		htmlmin:
			minify:
				options:
					removeComments: true
					removeCommentsFromCDATA: true
					removeCDATASectionsFromCDATA: true
					collapseWhitespace: true
					collapseBooleanAttributes: true
					removeAttributeQuotes: false
					removeRedundantAttributes: false
					useShortDoctype: true
					removeEmptyAttributes: false
					removeOptionalTags: false
				files: [
					{
						expand: true
						cwd: 'src'
						src: '**/*.html'
						dest: 'dist'
					}
				]

	grunt.loadNpmTasks 'grunt-contrib-clean'
	grunt.loadNpmTasks 'grunt-contrib-copy'
	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-contrib-concat'
	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-contrib-cssmin'
	grunt.loadNpmTasks 'grunt-contrib-htmlmin'
	grunt.loadNpmTasks 'grunt-bowercopy'

	grunt.registerTask 'dev', ['clean:first', 'copy:base', 'copy:dev', 'coffee:*', 'bowercopy', 'concat', 'clean:final']
	grunt.registerTask 'product', ['clean:first', 'copy:base', 'coffee:*', 'bowercopy', 'concat', 'uglify', 'cssmin',
																 'htmlmin',
																 'clean:final']
