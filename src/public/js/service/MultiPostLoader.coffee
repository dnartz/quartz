# 多篇文章的服务
quartzService.factory 'MultiPostLoader', ['Post', 'Category', 'Tag', '$rootScope', '$q', '$route', 'titleFn',
	(Post, Category, Tag, $rootScope, $q, $route, titleFn)->
		prevType = ''
		prevTag = ''
		prevCategory = ''
		(args)->
			delay = $q.defer()

			typ = ({Post: Post, Category: Category, Tag: Tag })[args.type]
			if $route.current.$$route.originalPath is '/' then ttyp = 'HomePage' else ttyp = args.type

			# 判断是否为同一页面的请求
			if prevType isnt args.type or prevTag isnt $route.current.params.tag or prevCategory isnt $route.current.params.category
				# 如果不是，就清空文章数组
				prevType = args.type
				prevTag = $route.current.params.tag
				prevCategory = $route.current.params.category
				$rootScope.posts = []
			else
				if $rootScope.posts.length > args.offset
					delay.resolve $rootScope.posts
					return delay.promise

			delete args.type

			if typ is Category then args.category = $route.current.params.category
			if typ is Tag then args.tag = $route.current.params.tag

			typ.query(args, (posts)->
				# 按照页面类型设定标题
				if _.isUndefined ttyp then ttyp = 'HomePage'
				titleFn ttyp

				# 连接文章数组
				if $rootScope.posts.length is 0
					$rootScope.posts = posts
				else
					$rootScope.posts = $rootScope.posts.concat posts

				if posts.length is 0 then $rootScope.allPostsLoaded = true

				$rootScope.lastPostOrd = $rootScope.posts.length

				delay.resolve posts
			, ->
				delay.reject '获取文章失败。')

			delay.promise
]