# 文章标签资源
quartzService.factory 'Tag', ['$resource', ($resource)->
	return $resource('/api/tag/:tag', {tag: '@tag'})
]