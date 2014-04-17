rd = require 'rd'
fs = require 'fs'
path = require 'path'

{_} = require 'underscore'

# 读取所有文章信息

posts = []
postsIdIndex = {}

JSONList = []

rd.eachSync __dirname + '/../data/posts', (f)->
	if '.json' is path.extname f then JSONList.push f

for filename in JSONList
	posts.push JSON.parse fs.readFileSync filename, null

	# 将文章id转化为number
	_.last(posts).id = parseInt _.last(posts).id, 10
	postsIdIndex[_.last(posts).id] = _.last posts

# 按发表日期，从新到旧排列文章
posts.sort (a, b)->
	b.postDate - a.postDate

tags = []
tagsIndex = {}
# 按照排序好的文章构建标签索引
for post in posts
	for tag in post.tags
		if _.isArray(tagsIndex[tag]) isnt true then tagsIndex[tag] = []
		if tagsIndex[tag].indexOf(posts) then tagsIndex[tag].push post

		if tags.indexOf(tag) is -1 then tags.push tag

###*
  * @property {object[]} posts 按发表日期从新到旧排列的文章数组
###
exports.posts = posts

###*
  * @property {object} postsIdIndex 以文章id为属性名的索引
###
exports.postsIdIndex = postsIdIndex

###*
  * @property {object} tags 各标签下的索引
###
exports.tagsIndex = tagsIndex
exports.tags = tags
