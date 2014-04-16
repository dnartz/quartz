angular.module('quartz.theme', ['quartz.config', 'ngRoute', 'infinite-scroll'])
.config(['$routeProvider', 'routeUrls', 'maxPostsPerReq'
		($routeProvider, routeUrls, maxPostsPerReq)->
			# 主页
			$routeProvider.when(routeUrls.HomePage, {
				controller: 'MultiPostCtrl'
				resolve:
					posts: (MultiPostLoader)->
						MultiPostLoader {
							type: 'Post'
							offset: 0
							limit: maxPostsPerReq
							get: ['id', 'tags', 'title', 'content', 'postDate', 'category']
							moreTag: true
						}
					type: ->
						'Post'
				templateUrl: 'multipost.html'

			# 分类
			}).when(routeUrls.Category, {
				controller: 'MultiPostCtrl'
				resolve:
					posts: (MultiPostLoader)->
						MultiPostLoader {
							type: 'Category'
							offset: 0
							limit: maxPostsPerReq
							get: ['id', 'tags', 'title', 'content', 'postDate']
							moreTag: true
						}
					type: ->
						'Category'
				templateUrl: 'multipost.html'

			# 标签
			}).when(routeUrls.Tag, {
				controller: 'MultiPostCtrl'
				resolve:
					posts: (MultiPostLoader)->
						MultiPostLoader {
							type: 'Tag'
							offset: 0
							limit: maxPostsPerReq
							get: ['id', 'tags', 'title', 'content', 'postDate']
							moreTag: true
						}
					type: ->
						'Tag'
				templateUrl: 'multipost.html'
			# 单篇文章
			}).when(routeUrls.Single, {
				controller: 'PostCtrl'
				resolve:
					post: (PostLoader)->
						PostLoader()
				templateUrl: '/public/themes/tanzaku/post.html'

			# 404页面
			}).when(routeUrls['404'], {
				resolve:
					t: (NotFoundLoader)->
						NotFoundLoader()
				controller: 'NotFoundCtrl'
				templateUrl: '/public/themes/tanzaku/404.html'
			}).otherwise({redirectTo: '/404'})
	]).service('redrawGrid', ['$rootScope', ($rootScope)->
		->
			isSinglePost = $rootScope.meta.isSinglePost
			setGrid = ->
				$("#grid-wrapper").vgrid
					easeing: "easeOutQuint"
					time: 800
					delay: 60
					selRefGrid: "#grid-wrapper div.x1"
					selFitWidth: [
						"#container"
						"#footer"
					]
					gridDefWidth: 290 + 15 + 15 + 5
					forceAnim: true

			$('#grid-wrapper').css('display','none') if isSinglePost

			$(window).load (e) ->
				setTimeout (->
					# prevent flicker in grid area - see also style.css
					$("#grid-wrapper").css "paddingTop", "0px"
				), 1000

			setTimeout setGrid, 300

			setTimeout (->
				if isSinglePost
					anim_msec = $("#single-wrapper").height()
					anim_msec = 1000  if anim_msec < 1000
					anim_msec = 3000  if anim_msec > 3000
					$("#single-wrapper").css("paddingTop", "0px").hide().slideDown anim_msec

				($("#header").hide().css("visibility", "visible").fadeIn 500) if $('#header').css('visibility') is 'hidden'
			), 500
	]).controller('MultiPostCtrl',
	['$rootScope', 'Post', 'MultiPostLoader', 'redrawGrid', 'maxPostsPerReq', 'type',
		($rootScope, Post, MultiPostLoader, redrawGrid, maxPostsPerReq, type)->
			redrawGrid()
			$rootScope.LoadMore = ->
				MultiPostLoader {
					type: type
					offset: $rootScope.lastPostOrd
					limit: maxPostsPerReq
					get: ['id', 'tags', 'title', 'content', 'postDate']
					moreTag: true
				}
				if ($rootScope.allPostsLoaded) then $rootScope.LoadMore = ->

	]).controller('PostCtrl', ['redrawGrid', (redrawGrid)->
		redrawGrid()
	]).controller('NotFoundCtrl', [->
	])
