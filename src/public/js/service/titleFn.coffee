# 页面标题函数
quartzService.service 'titleFn', ['$rootScope', '$route', ($rootScope, $route)->
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
]