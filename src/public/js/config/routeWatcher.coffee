# 对博客当前所处的地址进行监视
quartz.run ['$rootScope',($rootScope)->
	# 监视路由变化，并修改当前相应的页面
	$rootScope.$on '$routeChangeSuccess', (e, currentRoute)->
		currentRoute = currentRoute.$$route.originalPath
		$rootScope.meta.isHomePage = currentRoute is $rootScope.meta.routeUrls.HomePage
		$rootScope.meta.isSinglePost = currentRoute is $rootScope.meta.routeUrls.Single
		$rootScope.meta.is404 = currentRoute is $rootScope.meta.routeUrls['404']
		$rootScope.meta.isArchive = currentRoute is $rootScope.meta.routeUrls.Archive
		$rootScope.meta.isCategory = currentRoute is $rootScope.meta.routeUrls.Category
		$rootScope.meta.isTagPage = currentRoute is $rootScope.meta.routeUrls.Tag
]