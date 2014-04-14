url = require 'url'

post = require './models/post'
getCategory = require './models/archive'
meta = JSON.stringify require './dao/meta'

config = require './data/config/config'

currentTheme = 'tanzaku'
setInterval(->
	currentTheme = config.themesList[parseInt(Math.random() * (config.themesList.length - 1))]
, 3600000)

#
# * GET main frame.
#
exports.index = (req, res) ->
	# 发送博客框架主体前，先排除静态资源请求的可能
	req.url = url.parse(req.url, true).pathname
	if req.url.substr(0, 7) isnt '/public'
		res.sendfile "public/themes/#{currentTheme}/index.html"
	else
		res.sendfile(req.url.substring(1), null, (err)->
			if err then res.sendfile "public/themes/#{currentTheme}/index.html")

#
# * GET blog info
#
exports.meta = (req, res)->
	res.send meta

#
# * GET single post content
#
exports.post = (req, res)->
	result = post.getAllById req.param 'id'
	if result is false
		res.status(404).send()
	else
		res.send JSON.stringify result[0]

#
# * GET multi posts data
#
exports.multiPost = (req, res)->
	query = (url.parse req.url, true).query
	if query.moreTag == 'true' then query.moreTag = true else query.moreTag = false

	ret = post.getPropertiesByOrder(
		[parseInt(query.offset, 10)...parseInt(query.offset + query.limit, 10)],
		query.get,
		query.moreTag)
	if ret is false
		res.send([])
	else
		res.send JSON.stringify ret

#
# * GET archive
#
exports.archive = (req, res)->
	res.send JSON.stringify getCategory req.param 'get'

#
# * GET posts by categories
#
exports.getPostsByCategories = (req, res)->
	query = (url.parse req.url, true).query
	query.offset = parseInt(query.offset, 10)
	query.limit = parseInt(query.limit, 10)
	if query.moreTag == 'true' then query.moreTag = true else query.moreTag = false

	if query.limit > config.maxPostPerRequest
		res.status(404).send()
	else
		result = post.getPropertiesByCategory(
			req.param('category'),
			query.get,
			query.offset,
			query.limit,
			query.moreTag)

		if result is false
			res.send([])
		else
			res.send JSON.stringify result

#
# * GET posts by single tag
#
exports.getPostsBySingleTag = (req, res)->
	query = (url.parse req.url, true).query
	query.offset = parseInt(query.offset, 10)
	query.limit = parseInt(query.limit, 10)
	if query.moreTag == 'true' then query.moreTag = true else query.moreTag = false

	result = post.getPropertiesByTag(
		req.param('tag'),
		query.get,
		query.offset,
		query.limit,
		query.moreTag
	)

	if result is false
		res.send([])
	else
		res.send JSON.stringify result

#
# * 获取favicon
#
exports.getFavicon = (req, res)->
	res.sendfile 'public/favicon.ico'