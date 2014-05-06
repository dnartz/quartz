# 文章评论资源
quartzService.factory 'Comment', ['$resource', ($resource)->
	return $resource '/api/comment/p/:id', {id : '@id'},{
		save :
			method : 'POST'
			isArray : false
			responseType : 'json'
			url : '/api/comment'
	}
]