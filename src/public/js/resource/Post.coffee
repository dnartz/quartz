# 文章资源
quartzService.factory 'Post', ['$resource', ($resource)->
	return $resource '/api/p/:id', {id: '@id'}
]