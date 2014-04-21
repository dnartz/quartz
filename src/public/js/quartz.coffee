angular.module('quartz', ['quartz.services', 'quartz.config', 'quartz.theme', 'ngSanitize'])
.config(['$locationProvider', ($locationProvider)->
		$locationProvider.html5Mode true
	]).run(['$rootScope', '$route', '$http', 'routeUrls', ($rootScope, $route, $http, routeUrls)->
		$http.get('/api/meta').success (data)->
			if _.isObject($rootScope.meta) isnt true then $rootScope.meta = {}
			$rootScope.meta = _.extend $rootScope.meta, data

		# 监视路由变化，并修改当前相应的页面
		$rootScope.$on '$routeChangeSuccess', (e, currentRoute)->
			# 判断当前页面
			currentRoute = currentRoute.$$route.originalPath
			$rootScope.meta.isHomePage = currentRoute is routeUrls.HomePage
			$rootScope.meta.isSinglePost = currentRoute is routeUrls.Single
			$rootScope.meta.is404 = currentRoute is routeUrls['404']
			$rootScope.meta.isArchive = currentRoute is routeUrls.Archive
			$rootScope.meta.isCategory = currentRoute is routeUrls.Category
			$rootScope.meta.isTagPage = currentRoute is routeUrls.Tag
	])

# 页面标题函数
quartzService = angular.module('quartz.services', ['ngResource', 'ngRoute'])
.service('titleFn', ['$rootScope', '$route', ($rootScope, $route)->
		(type)->
			$rootScope.meta.title = ({
				Post : ->
					$rootScope.post.title + ' | ' + $rootScope.meta.blogName
				HomePage : ->
					$rootScope.meta.blogName + ' | ' + $rootScope.meta.blogDescription
				Category : ->
					'» ' + $route.current.params.category + ' | ' + $rootScope.meta.blogName
				Tag : ->
					'» ' + $route.current.params.tag + ' | ' + $rootScope.meta.blogName
				Archive : ->
					"» 所有文章 | #{$rootScope.meta.blogName}"
				"404" : ->
					"404 | #{$rootScope.meta.blogName}"
			})[type]()
	])

# 多篇文章的服务
quartzService.factory('Post', ['$resource', ($resource)->
	return $resource '/api/p/:id', {id : '@id'}
]).factory('MultiPostLoader', ['Post', 'Category', 'Tag', '$rootScope', '$q', '$route', 'titleFn'
	(Post, Category, Tag, $rootScope, $q, $route, titleFn)->
		prevType = ''
		prevTag = ''
		prevCategory = ''
		(args)->
			delay = $q.defer()

			typ = ({Post : Post, Category : Category, Tag : Tag })[args.type]
			if $route.current.$$route.orginalPath = '/' then ttyp = 'HomePage' else ttyp = args.type

			# 判断是否为同一页面的请求
			if prevType isnt args.type or prevTag isnt $route.current.params.tag or prevCategory isnt $route.current.params.category
				# 如果不是，就清空文章数组

				prevType = args.type
				prevTag = $route.current.params.tag
				prevCategory = $route.current.params.category
				$rootScope.posts = []
			else
				if $rootScope.posts.length>args.offset
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
				delay.reject 'Unable to Fetch posts')

			delay.promise
])

# 单篇文章的服务
quartzService.factory('PostLoader', ['Post', '$q', '$route', '$rootScope' , 'titleFn'
	(Post, $q, $route, $rootScope, titleFn)->
		->
			delay = $q.defer()
			Post.get id : $route.current.params.id, (post) ->
				if post.title != $route.current.params.title then window.location = '/404'
				$rootScope.post = post
				titleFn('Post');
				delay.resolve post
			, ->
				delay.reject "Unable to fetch post #{$route.current.params.id}"
			delay.promise
])

# 文章分类服务
quartzService.factory('Category', ['$resource', ($resource)->
	return $resource '/api/category/:category', {category : '@category'}
])

# 文章标签服务
quartzService.factory('Tag', ['$resource', ($resource)->
	return $resource('/api/tag/:tag', {tag : '@tag'})
])

# 文章存档服务
quartzService.factory('Archive', ['$resource', ($resource)->
	return $resource '/api/archive', {}
]).factory('ArchiveLoader', ['$rootScope', 'Archive', '$q', 'titleFn', ($rootScope, Archive, $q, titleFn)->
	(properties, moreTag = false)->
		delay = $q.defer()

		Archive.get({
				get : properties
				moreTag : moreTag
			}, (archive)->
			titleFn 'Archive'
			delay.resolve archive
		, ->
			delay.reject 'Unable to fetch archive')

		delay.promise
])

quartzService.factory('NotFoundLoader',
	['$rootScope', '$interval', '$q', 'titleFn', ($rootScope, $interval, $q, titleFn)->
		->
			delay = $q.defer()
			interv = $interval ->
				if _.isObject($rootScope.meta) and $rootScope.meta.hasOwnProperty('blogName')
					titleFn '404'
					delay.resolve 404
					$interval.cancel interv
			, 10

			delay.promise
	])

# 博客系统的常量以及变量初始化
quartzConfig = angular.module('quartz.config', []).constant('routeUrls', {
	HomePage : '/'
	"404" : '/404'
	Archive : '/archive'
	Category : '/category/:category'
	Single : '/:id/:title'
	Tag : '/tag/:tag'
}).constant('maxPostsPerReq', 15)