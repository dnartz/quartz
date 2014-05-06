# 发表评论服务
quartzService.factory 'AddComment', ['Comment', '$q', '$rootScope', (Comment, $q, $rootScope)->
	(args)->
		delay = $q.defer()
		Comment.save {
			postId : args.postId
			content : args.content
			author : args.author
			authorEmail : args.authorEmail
			authorHomePage : args.authorHomePage
		}, (res)->
			$rootScope.ResetCommentForm()

			# 显示用户新添加的评论
			if !_.isArray $rootScope.post.comments then $rootScope.post.comments = []
			$rootScope.post.comments.unshift res.comment
			$rootScope.post.commentCount++

			$rootScope.commentSubmitStatus = res
			delay.resolve res
		, (err) ->
			$rootScope.commentSubmitStatus = err.data
			delay.reject err.data
]