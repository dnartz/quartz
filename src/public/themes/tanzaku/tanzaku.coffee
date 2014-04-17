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
							get: ['id', 'tags', 'title', 'content', 'postDate', 'category']
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
		lastPostCount = 0
		###*
       重绘网格
		###
		setGrid = ->
			$("#grid-wrapper").vgrid
				easeing: "easeOutQuint"
				time: 500
				delay: 0
				selRefGrid: "#grid-wrapper div.x1"
				selFitWidth: [
					"#container"
					"#footer"
				]
				gridDefWidth: 290 + 15 + 15 + 5
				forceAnim: true
		->
			# 对一些比含有较大的图片的文章，我们可以适当增大其宽度
			postDivs = $('#grid-wrapper>div:not(:has(>.grid-image))>.post-body')
			for postDiv in postDivs
				# 如果找到合适的图片，那么就计算是否需要进行调整
				#if $(postDiv).find('img').first().length>0

			if $rootScope.posts?.length is lastPostCount then return null

			isSinglePost = $rootScope.meta.isSinglePost

			$('#grid-wrapper').css('display', 'none') if isSinglePost

			# prevent flicker in grid area - see also style.css
			$("#grid-wrapper").css "paddingTop", "0px"

			setTimeout setGrid, 10

			if isSinglePost
				anim_msec = $("#single-wrapper").height()
				anim_msec = 1000  if anim_msec < 1000
				anim_msec = 3000  if anim_msec > 3000
				$("#single-wrapper").css("paddingTop", "0px").hide().slideDown anim_msec

			($("#header").hide().css("visibility", "visible").fadeIn 500) if $('#header').css('visibility') is 'hidden'

			setTimeout(->
				# 解锁LoadMore锁
				$rootScope.LoadMoreLock = false
			, 1500)

			lastPostCount = $rootScope.posts.length
	]).controller('MultiPostCtrl',
	['$rootScope', 'Post', 'MultiPostLoader', 'redrawGrid', 'maxPostsPerReq', 'type',
		($rootScope, Post, MultiPostLoader, redrawGrid, maxPostsPerReq, type)->
			redrawGrid()
			$rootScope.LoadMore = ->
				if $rootScope.LoadMoreLock isnt true
					$rootScope.LoadMoreLock = true
					MultiPostLoader({
						type: type
						offset: $rootScope.lastPostOrd
						limit: maxPostsPerReq
						get: ['id', 'tags', 'title', 'content', 'postDate']
						moreTag: true
					}).then redrawGrid
				if ($rootScope.allPostsLoaded) then $rootScope.LoadMore = ->

	]).controller('PostCtrl', ['redrawGrid', (redrawGrid)->
		redrawGrid()
	]).controller('NotFoundCtrl', [->
	])
