# 按文章id获取评论的服务
quartzService.factory 'CommentLoader', ['$rootScope', '$q', 'Comment', ($rootScope, $q, Comment)->
	(args)->
		delay = $q.defer()

		Comment.query({
			id : args.id
			offset : args.offset
			limit : args.limit
			get : args.get
		}, (comments)->
			$rootScope.post.comments = comments
			delay.resolve comments
		,->
			delay.reject 'Unable to fetch comments')
]