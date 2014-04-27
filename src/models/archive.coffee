{_} = require 'underscore'
{postFields} = require __dirname + '/../data/config/config'

{cutContent} = require __dirname + '/../utility/post'

categories = (require __dirname + '/../dao/category').reduce (prev, a)->
	if _.isArray(prev) isnt true then prev = []
	prev.push {
		name : a
		posts : []
		postCount : 0
	}
	return prev

{posts} = require __dirname + '/../dao/post'

for post in posts
	for val,key in categories
		if val.name == post.category
			categories[key].postCount++
			categories[key].posts.push post

###*
  * 获取文章分类，以及各分类包含的文章的属性
  * @param {string[]} Fields 要获取的文章的属性数组
  * @param {boolean} [moreTag] 是否不获取moreTag之后的内容
###
module.exports = (Fields, moreTag = false)->
	Fields = _.intersection Fields, postFields

	ret = {}
	for category in categories
		ret[category.name] = {}
		ret[category.name].name = category.name
		ret[category.name].posts = []
		for post in category.posts
			ret[category.name].posts.push {}
			for filed in Fields
				if filed is 'content'
					_.last(ret[category.name].posts)[filed] = cutContent post[filed], moreTag
				else
					_.last(ret[category.name].posts)[filed] = post[filed]

	return ret
