fs = Quartz.lib.fs
rd = Quartz.lib.rd
path = Quartz.lib.path

_ = Quartz.lib._

{postsIdIndex} = Quartz.dao.post

# 评论对象（按评论id排序）
comments = {}

# 文章评论对象（按文章id排序）
postComments = {}

# 最大评论id
maxCommentId = 0

# JSON文件名列表
JSONList = []

rd.eachSync __dirname + '/../data/comments', (f)->
	if '.json' is path.extname f then JSONList.push f

for filename in JSONList
	unit = JSON.parse fs.readFileSync filename
	comments[unit.id] = unit

	postsIdIndex[unit.postId].commentCount++

	maxCommentId = unit.id if unit.id > maxCommentId
	if _.isArray postComments[unit.postId]
		postComments[unit.postId].push unit
	else
		postComments[unit.postId] = [unit]

# 对于按文章id分类的评论索引，以按日期从早到晚的方式排序
for postId of postComments
	postComments[postId].sort (a, b)->
		b.commentDate - a.commentDate

exports.comments = comments
exports.postComments = postComments
exports.maxCommentId = maxCommentId