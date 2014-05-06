# 文章归档服务
quartzService.factory 'ArchiveLoader', ['$rootScope', 'Archive', '$q', 'titleFn', ($rootScope, Archive, $q, titleFn)->
	(properties, moreTag = false)->
		delay = $q.defer()

		Archive.get {
			get: properties
			moreTag: moreTag
		}, (archive)->
			titleFn 'Archive'
			delay.resolve archive
		, ->
			delay.reject 'Unable to fetch archive'

		delay.promise
]