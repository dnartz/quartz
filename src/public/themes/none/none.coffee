angular.module('quartz.theme', ['quartz.config', 'ngRoute', 'ngAnimate', 'infinite-scroll'])
.config(['$routeProvider', 'routeUrls', 'maxPostsPerReq'
		($routeProvider, routeUrls, maxPostsPerReq)->
			# 主页
			$routeProvider.when(routeUrls.HomePage, {
				controller: 'MultiPostCtrl'
				resolve:
					posts: ['MultiPostLoader', (MultiPostLoader)->
						MultiPostLoader {
							type: 'Post'
							offset: 0
							limit: maxPostsPerReq
							get: ['id', 'tags', 'title', 'content', 'postDate']
							moreTag: true
						}
					]
					type: ->
						'Post'
				templateUrl: 'multipost.html'

			# 分类
			}).when(routeUrls.Category, {
				controller: 'MultiPostCtrl'
				resolve:
					posts: ['MultiPostLoader', (MultiPostLoader)->
						MultiPostLoader {
							type: 'Category'
							offset: 0
							limit: maxPostsPerReq
							get: ['id', 'tags', 'title', 'content', 'postDate']
							moreTag: true
						}
					]
					type: ->
						'Category'
				templateUrl: 'multipost.html'

			# 标签
			}).when(routeUrls.Tag, {
				controller: 'MultiPostCtrl'
				resolve:
					posts: ['MultiPostLoader', (MultiPostLoader)->
						MultiPostLoader {
							type: 'Tag'
							offset: 0
							limit: maxPostsPerReq
							get: ['id', 'tags', 'title', 'content', 'postDate']
							moreTag: true
						}
					]
					type: ->
						'Tag'
				templateUrl: 'multipost.html'
			# 单篇文章
			}).when(routeUrls.Single, {
				controller: 'PostCtrl'
				resolve:
					post: ['PostLoader', (PostLoader)-> PostLoader()]
				templateUrl: '/public/themes/none/post.html'

			# 文章存档
			}).when(routeUrls.Archive, {
				controller: 'ArchiveCtrl'
				resolve:
					archive: ['ArchiveLoader', (ArchiveLoader)-> ArchiveLoader ['id', 'title', 'postDate'], true]
				templateUrl: '/public/themes/none/archive.html'

			# 404页面
			}).when(routeUrls['404'], {
				resolve:
					t: ['NotFoundLoader', (NotFoundLoader)-> NotFoundLoader()]
				controller: 'NotFoundCtrl'
				templateUrl: '/public/themes/none/404.html'
			}).otherwise({redirectTo: '/404'})
	]).controller('MultiPostCtrl',
	['$rootScope', 'Post', 'MultiPostLoader', 'maxPostsPerReq', 'type',
		($rootScope, Post, MultiPostLoader, maxPostsPerReq, type)->
			$rootScope.LoadMore = ->
				MultiPostLoader {
					type: type
					offset: $rootScope.lastPostOrd
					limit: maxPostsPerReq
					get: ['id', 'tags', 'title', 'content', 'postDate']
					moreTag: true
				}
				if ($rootScope.allPostsLoaded) then $rootScope.LoadMore = ->
	]).controller('PostCtrl', [->
		# 淡出后面的图片
		$('header>img').fadeOut 1000
	]).controller('NotFoundCtrl', [->
	]).controller('ArchiveCtrl', ['$rootScope', 'archive', '$scope', ($rootScope, archive, $scope)->
		$rootScope.categories = archive
		$scope.tposts = []
		for key of archive
			if key[0] isnt '$'
				for post in archive[key].posts
					$scope.tposts.push post
		$scope.tposts.sort (a, b)->
			b.postDate - a.postDate

		val.postDate = new Date(val.postDate) for val in $scope.tposts

		# 对月份和年份进行划分
		months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
		for val,key in $scope.tposts
			if key is 0 or val.postDate.getFullYear() != $scope.tposts[key - 1].postDate.getFullYear()
				$scope.tposts[key].year = val.postDate.getFullYear()

			if key is 0 or months[val.postDate.getMonth()] != months[$scope.tposts[key - 1].postDate.getMonth()]
				$scope.tposts[key].month = months[val.postDate.getMonth()]

		$scope.curMonth = 0
]).directive('noneTitleInit', ->
	restrict: 'A'
	link: ->
		height = $(window).height()
		width = $(window).width()

		resize = ->
			height = $(window).height()
			width = $(window).width()
			$(".site-head .title").css "margin-top", height / 2 - 253
			$(".site-head").css "height", height

		resize()

		window.onresize = resize

		$('#down').click ->
			$(document.body).animate {scrollTop: height}, 1000

		$('#top-bg').css 'opacity', 0

		window.onscroll = ->
			blur = $("body").scrollTop() / height
			$("#top-bg").css "opacity", blur
).animation '.top-bg', ->
	{
		leave: (element, done)->
			$("html, body").animate { scrollTop: "0px" }
			$(element).fadeOut(1000, done)
	}
