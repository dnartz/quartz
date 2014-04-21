{posts} = require __dirname + '/../dao/post'
postIds = posts.map (a)-> parseInt a.id, 10
{postsIdIndex} = require __dirname + '/../dao/post'
{tagsIndex} = require __dirname + '/../dao/post'
tagsList = require(__dirname + '/../dao/post').tags

{postFileds} = require __dirname + '/../data/config/config'

categories = require __dirname + '/../dao/category'

# 初始化数组索引
categoriesIndex = {}
(categoriesIndex[category] = []) for category in categories
(categoriesIndex[post.category].push post)for post in posts

{cutContent} = require __dirname + '/../utility/post'

{_} = require 'underscore'

###*
  * 数组特殊辅助函数，去除数组中所有的false
  * @param {array} 数组
  * @return {array|boolean} 如果为空数组，那么返回false， 否则返回数组本身
###
isEmptyArray = (arr)->
	arr = _.without(arr, false)
	if _.isEmpty(arr) then return false else return arr

###*
	* 根据提供的数组下标获取文章数组的文章id
  * @param {number|number[]} arr 数组下表
  * @return {number|number[]} 对于number表示的数组下标，返回一个对应的文章id
  *                           对于数组存放的数组下标，返回相应的文章id数组，如果没有匹配ID，则返回FALSE
###
arrayIndex2PostId = (arr)->
	if _.isArray(arr) isnt true then arr = [arr]

	return isEmptyArray arr.map (a)->
		if _.isObject(posts[a]) isnt true
			return false
		else
			return parseInt posts[a].id, 10

###*
  * 检查查询的属性数组的合法性
  * @param {string[]} properties
  * @return {string[]|boolean} 返回格式规范化之后的属性数组，若操作失败，则返回false
###
propertiesCheck = (properties)->
	if _.isArray(properties) isnt true then properties = [properties]
	if _.intersection(properties, postFileds).length is 0 then return false else return properties

{idsCheck} = require __dirname + '/../utility/misc'

###*
  * 检查文章Id的和要查询的属性数组的合法性
  * @param {fcuntion} 要操作的函数
###
idsAndPropertiesCheck = (fn)->
	return (args...)->
		# 检查文章id数组的合法性
		if (ids = idsCheck args[0]) is false then return false

		args[1] = propertiesCheck args[1]
		if _.intersection(ids, postIds).length is 0 or args[1] is false
			return false

		return fn?.apply(that, [ids].concat args[1..])

###*
  * 按照文章id以及提供的属性数组来获取文章的属性
  * @param {number} id 文章的id
  * @param {string[]} properties 要获取的属性数组
  * @param {boolean} [moreTag] 是否只获取More Tag之前的内容，默认为false
  * @return {object|boolean} post 如果成功，就返回一个文章对象，否则返回false
###
fetchPropertiesById = (id, properties, moreTag)->
	if _.isUndefined postsIdIndex[id] then return false

	ret = {}

	for property in properties
		ret[property] = postsIdIndex[id][property]
		if property is 'content'
			ret.content = cutContent ret.content, moreTag
			ret.moreTag = !(ret.content is postsIdIndex[id]['content'])
	return ret

module.exports =
	###*
		* 获取一篇或多篇文章的某一特定属性
		* @params {number|number[]} id 文章id
		* @params {string|string[]} properties 查询的属性
		* @param {boolean} [moreTag] 是否只获取More Tag之前的内容，默认为false
		* @return {array} 返回带有所求属性的数组
	###
	getPropertiesById: idsAndPropertiesCheck (ids, properties, moreTag = false)->
		isEmptyArray ids.map (id)->
			fetchPropertiesById id, properties, moreTag

	###*
		* 获取指定分类下的所有文章
		* @param {string|string[]} categories 要获取的分类名称
		* @param {string|string[]} properties 查询的属性
		* @param {number} [offset] 文章数组起始的偏移，只有当categories只有一个且提供了limit时才生效
		* @param {number} [limit] 获取文章的长度，只有当categories只有一个且提供了offset时才生效
		* @param {boolean} [moreTag] 是否只获取More Tag之前的内容，默认为false
		* @return {array|boolean} 返回一个按文章类别分类的数组，如果没有查询到任何文章，就返回false
		*                         如果只查询一个分类的文章，那么只返回一个该分类文章的数组
	###
	getPropertiesByCategory: (categoriesArr, properties, offset = null, limit = null, moreTag = false)->
		if (properties = propertiesCheck properties) is false then return false

		if _.isArray(categoriesArr) isnt true then categoriesArr = [categoriesArr]
		if (categoriesArr = _.intersection categoriesArr, categories).length is 0 then return false

		if categoriesArr.length is 1 and (offset < 0 or limit < 1) then return false

		ret = []
		(ret.push {name: val, posts: []}) for val in categoriesArr

		# 从分类索引中获取文章
		# 如果只查询一个分类，并且提供了limit和offset，那么就将文章限定在limit和offset之间
		for val in ret
			for key, post of categoriesIndex[val.name]
				if categoriesArr.length is 1 and offset >= 0 and limit > 0 and key >= offset or categoriesArr.length > 1
					val.posts.push fetchPropertiesById post.id, properties, moreTag
					if categoriesArr.length is 1 and val.posts.length >= limit then break

		if _.isEmpty ret
			return false
		else
			# 如果只查询一个分类的文章，那么只返回一个该分类文章的数组
			if categoriesArr.length is 1 then ret = ret[0].posts
			return ret

	###*
		* 通过标签查询多篇文章
		* @param {string|string[]} 要查询的标签
		* @param {string|string[]} 要查询的文章属性
		* @param {number|null} [offset] 文章起始编号，只提供一个标签时才有效
		* @param {number|null} [limit] 文章起始编号，只提供一个标签时才有效
		* @param {boolean} [moreTag] 是否只获取More Tag之前的内容，默认为false
		* @return {array|object|boolean} 如果只提供一个数组，那么只返回包含这个标签的文章数组，否则返回一个包含各种标签的对象，
																		 如果操作失败，则返回false
	###
	getPropertiesByTag: (tags, properties, offset = null, limit = null, moreTag = false)->
		if _.isArray(tags) isnt true then tags = [tags]
		tags = _.intersection tags, tagsList
		if tags.length is 0 then return false

		if (properties = propertiesCheck properties) is false then return false

		ret = {}
		for tag in tags
			ret[tag] = []
			for post,key in tagsIndex[tag]
				if tags.length is 1 and offset >= 0 and limit > 0 and ret[tag].length < limit and key >= offset or tags.length > 1
					ret[tag].push @getPropertiesById(post.id, properties, moreTag)[0]
					if tags.length is 1 and offset >= 0 and limit > 0 and ret[tag].length == limit then break

		if tags.length is 1 then ret = ret[tags[0]]
		return ret


	###*
		* 获取指定文章的所有信息
		* @param {number|number[]} id 文章id
		* @param {boolean} [moreTag] 是否只读取到More标记处，默认为false
	###
	getAllById: (ids, moreTag = false)->
		if (ids = idsCheck(ids)) is false then return false

		isEmptyArray ids.map (id)->
			if _.isObject(postsIdIndex[id]) isnt true then return false

			ret = _.extend {moreTag: moreTag}, postsIdIndex[id]
			# 如果moreTag为真，就进行相应处理
			if moreTag then  ret.content = cutContent ret.content, moreTag

			return ret

	###*
		* 以数组下标形式调用的API
	###
	getPropertiesByOrder: (ords, properties, moreTag = false)->
		@getPropertiesById arrayIndex2PostId(ords), properties, moreTag
	getAllByOrder: (ords, moreTag = false)->
		@getAllById arrayIndex2PostId(ords), moreTag

that = module.exports
