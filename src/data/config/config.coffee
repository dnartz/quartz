###
  主配置文件
###
module.exports = {
	HTMLType : 'text/html'
	blogPublic : true
	allowComments : true
	postFields : ['id', 'author', 'title', 'postDate', 'commentCount', 'category', 'content', 'tags']
	commentFields : ['id', 'postId', 'commentDate', 'author', 'authorIp', 'authorAgent', 'authorHomePage', 'authorEmail',
									 'authorEmailMD5', 'content']
	themesList : ['mylist', 'casper']
	maxPostPerRequest : 15
}