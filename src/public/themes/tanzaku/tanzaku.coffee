angular.module('quartz.theme', ['quartz.config', 'ngRoute', 'infinite-scroll'])
.config(['$routeProvider', 'routeUrls', 'maxPostsPerReq'
		($routeProvider, routeUrls, maxPostsPerReq)->
			# 主页
			$routeProvider.when(routeUrls.HomePage, {
				controller : 'MultiPostCtrl'
				resolve :
					posts : (MultiPostLoader)->
						MultiPostLoader {
							type : 'Post'
							offset : 0
							limit : maxPostsPerReq
							get : ['id', 'tags', 'title', 'content', 'postDate', 'category']
							moreTag : true
						}
					type : ->
						'Post'
				templateUrl : 'multipost.html'

			# 分类
			}).when(routeUrls.Category, {
				controller : 'MultiPostCtrl'
				resolve :
					posts : (MultiPostLoader)->
						MultiPostLoader {
							type : 'Category'
							offset : 0
							limit : maxPostsPerReq
							get : ['id', 'tags', 'title', 'content', 'postDate']
							moreTag : true
						}
					type : ->
						'Category'
				templateUrl : 'multipost.html'

			# 标签
			}).when(routeUrls.Tag, {
				controller : 'MultiPostCtrl'
				resolve :
					posts : (MultiPostLoader)->
						MultiPostLoader {
							type : 'Tag'
							offset : 0
							limit : maxPostsPerReq
							get : ['id', 'tags', 'title', 'content', 'postDate', 'category']
							moreTag : true
						}
					type : ->
						'Tag'
				templateUrl : 'multipost.html'
			# 单篇文章
			}).when(routeUrls.Single, {
				controller : 'PostCtrl'
				resolve :
					post : (PostLoader)-> PostLoader()
					comments : ($route, CommentLoader) ->
						CommentLoader {
							id : $route.current.params.id
							get : ['postDate', 'id', 'content', 'author', 'authorEmailMD5', 'commentDate']
							offset : 0
							limit : 15
						}
				templateUrl : '/public/themes/tanzaku/post.html'
			}).otherwise({redirectTo : '/'})
	]).service('redrawGrid', ['$rootScope', ($rootScope)->
		lastPostCount = 0
		###*
       重绘网格
		###
		setGrid = ->
			$("#grid-wrapper").vgrid
				easeing : "easeOutQuint"
				time : 500
				delay : 0
				selRefGrid : "#grid-wrapper div.x1"
				selFitWidth : [
					"#container"
					"#footer"
				]
				gridDefWidth : 290 + 15 + 15 + 5
				forceAnim : true
		# 对一些比含有较大的图片的文章，我们可以适当增大其宽度
		MAX_COL_SIZE = 2 # 每列最大大小(x1, x2, ……, xn)
		COL_WIDTH = 395 # 每列最大宽度
		COL_GAP_WIDTH = 35 # 每列间距

		# 各大小宽度数组
		arrWidth = (((COL_WIDTH * (x + 1)) + (COL_GAP_WIDTH * x)) for x in [0..MAX_COL_SIZE])
		(isRouteChange = false)->
			isSinglePost = $rootScope.meta.isSinglePost

			# 如果不是单文章页面，也不是路由更变，并且所有文章已经加载完成，那么就不用重绘
			if isSinglePost isnt true and isRouteChange isnt true and $rootScope.posts?.length is lastPostCount
				return null

			# 如果找到合适的图片，那么就计算是否需要进行调整
			if isSinglePost isnt true
				postDivs = $ '#grid-wrapper>div:not(:has(>.grid-image))'
				for postDiv in postDivs
					img = $(postDiv).find('img').first()[0];
					if img?
						width = img.clientWidth
						height = img.clientHeight

						for i in [0..MAX_COL_SIZE]
							if (i >= MAX_COL_SIZE - 1) or (width < arrWidth[i + 1])
								newWidth = arrWidth[i]
								colClass = 'x' + (i + 1)
								break
						newHeight = parseInt(newWidth * (height / width), 10)
						$('#' + $(postDiv).attr('id') + '>.post-title').after("<div class=\"grid-image\"><a href=\"" + $('#' + $(postDiv).attr('id') + '>.post-title>a').attr('href') + "\" title=\"#{$('#' + $(postDiv).attr('id') + '>.post-title').text()}\"><img src=\"#{$(img).attr('src')}\"></a>")
						$(img).remove()

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

			if isSinglePost isnt true then lastPostCount = $rootScope.posts.length
	]).controller('MultiPostCtrl',
	['$rootScope', 'Post', 'MultiPostLoader', 'redrawGrid', 'maxPostsPerReq', 'type',
		($rootScope, Post, MultiPostLoader, redrawGrid, maxPostsPerReq, type)->
			setTimeout(->
				redrawGrid(true)
			, 50)
			$rootScope.LoadMore = ->
				if $rootScope.LoadMoreLock isnt true
					$rootScope.LoadMoreLock = true
					MultiPostLoader({
						type : type
						offset : $rootScope.lastPostOrd
						limit : maxPostsPerReq
						get : ['id', 'tags', 'title', 'content', 'postDate']
						moreTag : true
					}).then redrawGrid
				if ($rootScope.allPostsLoaded) then $rootScope.LoadMore = ->

	]).controller('PostCtrl', ['redrawGrid', (redrawGrid)->
		redrawGrid(true)
	])
