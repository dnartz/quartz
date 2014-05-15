# 单篇文章的服务
quartzService.factory 'PostLoader', ['Post', '$q', '$route', '$rootScope' , 'titleFn'
	(Post, $q, $route, $rootScope, titleFn)->
		(get)->
			delay = $q.defer()
			Post.get id: $route.current.params.id, (post) ->
				if post.title != $route.current.params.title then window.location = '/404'
				$rootScope.post = post
				titleFn('Post');
				delay.resolve post
			, ->
				delay.reject "Unable to fetch post #{$route.current.params.id}"
			delay.promise
]