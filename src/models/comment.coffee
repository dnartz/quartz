{_} = require 'underscore'
{writeFile} = require 'fs'

{postsIdIndex} = require __dirname + '/../dao/post'

{comments} = require __dirname + '/../dao/comment'
{postComments} = require __dirname + '/../dao/comment'
{maxCommentId} = require __dirname + '/../dao/comment'

{commentFields} = require __dirname + '/../data/config/config'
{minCommentInterval} = require __dirname + '/../data/config/config'
minCommentInterval *= 1000

{idsCheck} = require __dirname + '/../utility/misc'
md5 = require __dirname + '/../utility/md5'

validator = require 'validator'
xssClean = require('sanitizer').sanitize

module.exports =
	###*
		* 通过评论id获取一条评论的所有信息
		* @param number id 要获取的评论id
		* @return object|boolean 如果成功，就返回包括评论所有信息的对象，否则返回false
	###
	getCommentById : (id)->
		if comments[parseInt(id, 10)]?
			return comments[parseInt(id, 10)]
		else
			return false

	###*
		* 按照文章id获取文章评论
		* @param {number[]|number} ids 要获取的评论的文章id
		* @param {string[]|string} properties 要获取的评论的属性
		* @param {number} offset 从第几篇评论开始
		* @param {number} limit 取多少篇评论
		* @return {object|array|boolean} 如果成功，就返回评论内容。
  																 如果只提供了一个文章id，那么就只返回这篇文章的评论的数组，否则返回一个以文章id为索引的对象
	###
	getCommentsByPostId : (ids, properties, offset, limit)->
		if (ids = idsCheck(ids)) is false then return false

		if _.isArray(properties) isnt true then properties = [properties]
		properties = _.intersection(commentFields, properties)
		if properties.length < 1 then return false

		ret = {}
		for id in ids
			if _.isUndefined(postComments[id]) isnt true
				ret[id] = []
				for comment, key in postComments[id]
					# 如果limit和offset参数生效，那么就检查是否需要取得这篇评论
					if ids.length isnt 1 or!(offset?) or !(limit?) or offset <= key and ret[id].length < limit
						ret[id].push {}
						for property of comment
							if property in properties then _.last(ret[id])[property] = postComments[id][key][property]

		if ids.length is 1 then ret = ret[ids[0]]

		return ret

	###*
		* 添加新评论
		* @param comment 评论参数，包括author,authorIp,authorAgent,authorEmail,
		*                authorHomePage（可选）,postId,content,lastComment
  	* @return {*} 返回一个表示操作结果的对象，包括status（HTTP状态码）,msg（返回信息）
	###
	addPostComment : (comment)->
		if (Date.now() - comment.lastComment) < minCommentInterval then return {status : 403, msg : '短时间内发表太多评论。'}

		# 所有输入进行一遍XSS消毒
		comment[field] = xssClean comment[field] for field of comment

		# 检查文章是否存在
		try
			comment.postId = parseInt comment.postId, 10
			if _.isUndefined postsIdIndex[comment.postId] then throw '找不到这篇文章。'

			# 检查内容是否为空
			if validator.isNull comment.content then throw '空的评论内容。'

			# 检查Email是否合法
			if validator.isEmail(comment.authorEmail) isnt true then throw '非法的Email格式。'

			# 检查用户IP是否合法
			if validator.isIP(comment.authorIp) isnt true then throw '非法的IP地址。'

			# 如果用户填写了主页地址，那么就检查主页地址是否合法
			if comment.authorHomePage.indexOf('http://') isnt -1 and validator.isURL(comment.authorHomePage) isnt true
				throw '非法的个人URL。'
		catch e
			return {status : 400, msg : e}

		comment.authorEmailMD5 = md5 comment.authorEmail
		comment.commentDate = Date.now()
		comment.id = ++ maxCommentId

		writeFile __dirname + "/../data/comments/#{comment.id}.json", JSON.stringify(comment), (err)->
			if err then console.log err

		return {status : 200, msg : '评论发表成功。'}
