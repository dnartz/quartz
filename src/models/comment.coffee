{_} = require 'underscore'

{comments} = require __dirname + '/../dao/comment'
{postComments} = require __dirname + '/../dao/comment'

{commentFields} = require __dirname + '/../data/config/config'

{idsCheck} = require __dirname + '/../utility/misc'

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
					if ids.length isnt 1 or!(offset?) or !(limit?) or offset >= key and (_.isUndefined(ret[id]) or ret[id].length < limit)
						ret[id].push {}
						for property of comment
							if property in properties then _.last(ret[id])[property] = postComments[id][key][property]

		if ids.length is 1 then ret = ret[ids[0]]

		return ret
