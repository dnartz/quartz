url = Quartz.lib.url
_ = Quartz.lib._

post = Quartz.api.post
comment = Quartz.api.comment
getCategory = Quartz.api.archive

meta = Quartz.config.meta
config = Quartz.config.system

currentTheme = 'casper'
# 每隔一段时间随机切换主题
setInterval(->
	currentTheme = config.themesList[parseInt(Math.random() * (config.themesList.length - 1))]
, 3600000)

# 将offset和query都转换成number
preTreatment = (fn)->
	(req, res)->
		query = (url.parse req.url, true).query

		if _.isUndefined query.moreTag then query.moreTag = Quartz.lib.utility.misc.char2Bool query.moreTag

		if _.isUndefined query.offset then query.offset = null else query.offset = parseInt query.offset, 10
		if _.isUndefined query.limit then query.limit = null else query.limit = parseInt query.limit, 10

		fn req, res, query

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
			if err
				res.sendfile "public/themes/#{currentTheme}/index.html")

#
# * GET blog info
#
exports.meta = (req, res)->
	res.json meta

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
exports.multiPost = preTreatment (req, res, query)->
	ret = post.getPropertiesByOrder(
		[query.offset...query.offset + query.limit],
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
exports.getPostsByCategories = preTreatment (req, res, query)->
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
			res.json []
		else
			res.json result

#
# * GET posts by single tag
#
exports.getPostsBySingleTag = preTreatment (req, res, query)->
	result = post.getPropertiesByTag(
		req.param('tag'),
		query.get,
		query.offset,
		query.limit,
		query.moreTag
	)

	if result is false
		res.json []
	else
		res.json result

#
# * GET comment by Id
#
exports.getCommentById = (req, res)->
	ret = comment.getCommentById req.param('id')
	if ret is false
		res.status(404).send()
	else
		res.json ret

#
# * GET comments by post id
#
exports.getCommentsByPostId = preTreatment (req, res, query)->
	ret = comment.getCommentsByPostId req.param('id'), query.get, query.offset, query.limit
	if ret is false
		res.status(404).send()
	else
		res.json ret

#
# * POST comment
#
exports.addPostComment = (req, res)->
	ret = comment.addPostComment {
		postId: parseInt req.body.postId, 10
		content: req.body.content
		author: req.body.author
		authorEmail: req.body.authorEmail
		authorHomePage: req.body.authorHomePage
		authorIp: req.headers['x-forwarded-for'] or req.ip
		authorAgent: req.get 'User-Agent'
		lastComment: req.session.lastComment or 0
	}

	req.session.lastComment = Date.now()
	res.status(ret.status).json ret

#
# * 获取favicon
#
exports.getFavicon = (req, res)->
	res.sendfile 'public/favicon.ico'