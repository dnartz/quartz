fs = require 'fs'
rd = require 'rd'
path = require 'path'

{_}=require 'underscore'

# 评论数组（按评论id排序）
comments = []

# 文章评论对象（按文章id排序）
postComments = []

# JSON文件名列表
JSONList = []

rd.eachSync __dirname + '/../data/comments', (f)->
	if '.json' is path.extname f then JSONList.push f

for filename in JSONList
	unit = JSON.parse fs.readFileSync filename
	comments[unit.id] = unit
	if _.isArray postComments[unit.postID]
		postComments[unit.postID].push unit
	else
		postComments[unit.postID] = [unit]

exports.comments = comments
exports.postComments = postComments