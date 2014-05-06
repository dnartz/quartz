# 文章分类资源
quartzService.factory 'Category', ['$resource', ($resource)->
	return $resource '/api/category/:category', {category: '@category'}
]