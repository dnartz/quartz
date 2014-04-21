{comments} = require __dirname + '/../dao/comment'
{postComments}=require __dirname + '/../dao/comment'

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

	#getCommentByPostId:idsAndPropertiesCheck(ids,properties)->

