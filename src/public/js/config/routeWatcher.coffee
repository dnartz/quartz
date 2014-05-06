# 对博客当前所处的地址进行监视
quartz.run ['$rootScope', '$route', '$http', 'routeUrls', ($rootScope, $route, $http, routeUrls)->
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
]