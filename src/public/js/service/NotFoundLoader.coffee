# 404页面服务
quartzService.factory 'NotFoundLoader',
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
]