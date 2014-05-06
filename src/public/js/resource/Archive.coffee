# 文章归档资源
quartzService.factory 'Archive', ['$resource', ($resource)->
	return $resource '/api/archive', {}
]