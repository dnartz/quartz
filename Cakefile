rd = require 'rd'
fs = require 'fs'
path = require 'path'

async = require 'async'
{_}=require 'underscore'

{exec}=require 'execSync'

{minify} = require 'html-minifier'

SRC = __dirname + '/src/'
DIST = __dirname + '/dist/'

###*
  * 简化执行命令
###
runCmd = (cmd)->
	console.log cmd
	res = exec cmd

	if res.stdout
		console.log res.stdout

###*
  * 简化命令
###
cp = (source, dist)->
	runCmd "cp -fv #{source} #{dist}"
mkdir = (dir)->
	runCmd "mkdir #{dir}"

###*
  * 构建函数
###
make = (isDev = true)->
	# 删除之前的dist文件夹
	runCmd "rm -fr #{DIST}"

	# -----------------
	# 复制所有静态资源
	include = ['*/',
						 'package.json',
						 'data/*.json'
						 'data/posts/*.json',
						 'data/config/*.json',
						 'data/comments/*.json',
						 'utility/md5.js',
						 'public/favicon.ico',
						 'public/js/*.js',
						 'public/css/*.css',
						 'public/themes/casper/css/*',
						 'public/themes/casper/fonts/*',
						 'public/themes/casper/js/*.js',
						 'public/themes/tanzaku/js/*.js',
						 'public/themes/*/*.html',
						 'public/themes/*/*.css']
	exclude = ['*',
						 'public/themes/*/*.js',
						 'public/themes/*/*.map',
						 'public/themes/*/*.coffee']
	rsyncCmd = 'rsync -a --include \'' + include.join('\' --include \'') + '\' --exclude \'' + exclude.join('\' --exclude \'') + "\' #{SRC} #{DIST}"
	runCmd rsyncCmd

	# -----------------
	# 编译CoffeeScript
	runCmd "coffee -b -c -o #{DIST} #{SRC}app.coffee"
	runCmd "coffee -b -c -o #{DIST} #{SRC}Quartz.coffee"
	runCmd "coffee -b -c -o #{DIST} #{SRC}routes.coffee"

	# 直接编译的目录
	direct = ['dao',
						'data',
						'models',
						'utility',
						'public/js',
						'public/themes']
	runCmd ("coffee -b -c -o #{DIST}#{dir} #{SRC}#{dir}" )for dir in direct

	noMt = (['public/themes/mylist/mylist.js',
					 'public/themes/tanzaku/tanzaku.js',
					 'public/themes/casper/casper.js']).map (a) -> return DIST + a

	# 生产环境下，压缩所有html,js,css
	rd.eachSync "#{DIST}public", (f)->
		fs.open f, 'r', (err)->
			if !err and isDev is false
				if '.js' is path.extname f
					if noMt.indexOf(f) is -1 then mt = '-mt' else mt = ''
					runCmd "uglifyjs #{mt} -c -o #{f} #{f}"
				else if '.html' is path.extname f
					fs.writeFileSync f, minify(fs.readFileSync(f, 'utf-8'), {
						removeComments : true
						removeCommentsFromCDATA : true
						removeCDATASectionsFromCDATA : true
						collapseWhitespace : true
						collapseBooleanAttributes : true
						removeAttributeQuotes : false
						removeRedundantAttributes : false
						useShortDoctype : true
						removeEmptyAttributes : false
						removeOptionalTags : false
						removeEmptyElements : false
					}), {encoding : 'utf-8'}
				else if '.css' is path.extname f
					runCmd "cleancss -o #{f} #{f}"

###*
  * 开发环境下的构建
###
task 'dev', 'Development mode', ->
	make true

###*
  * 生产环境下的构建
###
task 'product', 'Production mode', ->
	make false