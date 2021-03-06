angular.module('quartz.theme', ['quartz.config', 'ngRoute', 'infinite-scroll'])
.config(['$routeProvider', 'routeUrls'
		($routeProvider, routeUrls)->
			# 主页
			$routeProvider.when(routeUrls.HomePage, {
				controller : 'MultiPostCtrl'
				resolve :
					posts : ['MultiPostLoader', '$rootScope', (MultiPostLoader, $rootScope)->
						MultiPostLoader {
							type : 'Post'
							offset : 0
							limit : $rootScope.meta.maxPostsPerReq
							get : ['id', 'tags', 'title', 'content', 'postDate']
							moreTag : true
						}
					]
					type : -> 'Post'
				templateUrl : 'multipost.html'

			# 分类
			}).when(routeUrls.Category, {
				controller : 'MultiPostCtrl'
				resolve :
					posts : ['MultiPostLoader', '$rootScope', (MultiPostLoader, $rootScope)->
						MultiPostLoader {
							type : 'Category'
							offset : 0
							limit : $rootScope.meta.maxPostsPerReq
							get : ['id', 'tags', 'title', 'content', 'postDate']
							moreTag : true
						}
					]
					type : ->
						'Category'
				templateUrl : 'multipost.html'

			# 标签
			}).when(routeUrls.Tag, {
				controller : 'MultiPostCtrl'
				resolve :
					posts : ['MultiPostLoader', '$rootScope', (MultiPostLoader, $rootScope)->
						MultiPostLoader {
							type : 'Tag'
							offset : 0
							limit : $rootScope.meta.maxPostsPerReq
							get : ['id', 'tags', 'title', 'content', 'postDate']
							moreTag : true
						}
					]
					type : ->
						'Tag'
				templateUrl : 'multipost.html'
			# 单篇文章
			}).when(routeUrls.Single, {
				controller : 'PostCtrl'
				resolve :
					post : ['PostLoader', (PostLoader)-> PostLoader()]
					comments : ['$route', 'CommentLoader', ($route, CommentLoader) ->
						CommentLoader {
							id : $route.current.params.id
							get : ['postDate', 'id', 'content', 'author', 'authorEmailMD5', 'commentDate']
							offset : 0
							limit : 15
						}
					]
				templateUrl : '/public/themes/mylist/post.html'

			# 文章存档
			}).when(routeUrls.Archive, {
				controller : 'ArchiveCtrl'
				resolve :
					archive : ['ArchiveLoader', (ArchiveLoader)-> ArchiveLoader ['id', 'title', 'postDate'], true]
				templateUrl : '/public/themes/mylist/archive.html'

			# 404页面
			}).when(routeUrls['404'], {
				resolve :
					t : ['NotFoundLoader', (NotFoundLoader)-> NotFoundLoader()]
				controller : 'NotFoundCtrl'
				templateUrl : '/public/themes/mylist/404.html'
			}).otherwise({redirectTo : '/404'})
	]).controller('MultiPostCtrl',
	['$rootScope', 'Post', 'MultiPostLoader', 'type',
		($rootScope, Post, MultiPostLoader, maxPostsPerReq, type)->
			$rootScope.LoadMore = ->
				MultiPostLoader {
					type : type
					offset : $rootScope.lastPostOrd
					limit : $rootScope.meta.maxPostsPerReq
					get : ['id', 'tags', 'title', 'content', 'postDate']
					moreTag : true
				}
				if ($rootScope.allPostsLoaded) then $rootScope.LoadMore = ->
	]).controller('PostCtrl', ['$routeParams', '$scope', 'AddComment', '$rootScope'
		($routeParams, $scope, AddComment, $rootScope)->
			$scope.commentSubmit = {postId : $rootScope.post.id}
			$scope.AddComment = -> AddComment $scope.commentSubmit

			# 评论表单重置函数
			blankForm = {author : '', authorEmail : '', content : '', authorHomePage :''}
			$rootScope.ResetCommentForm = ->
				$scope.commentSubmit = blankForm
				$scope.commentSubmit.postId = $rootScope.post.id
	]).controller('NotFoundCtrl', [->
	]).controller('ArchiveCtrl', ['$rootScope', 'archive', '$scope', ($rootScope, archive, $scope)->
		$rootScope.categories = archive
		$scope.tposts = []
		for key of archive
			if key[0] isnt '$'
				for post in archive[key].posts
					$scope.tposts.push post
		$scope.tposts.sort (a, b)-> b.postDate - a.postDate

		val.postDate = new Date(val.postDate) for val in $scope.tposts

		# 对月份和年份进行划分
		months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']
		for val,key in $scope.tposts
			if key is 0 or val.postDate.getFullYear() != $scope.tposts[key - 1].postDate.getFullYear()
				$scope.tposts[key].year = val.postDate.getFullYear()

			if key is 0 or months[val.postDate.getMonth()] != months[$scope.tposts[key - 1].postDate.getMonth()]
				$scope.tposts[key].month = months[val.postDate.getMonth()]

		$scope.curMonth = 0
]).directive "clickIf", ->
		scope:
			method: "&"
			condition: "&clickIf"

		link: ($scope, elem, attrs) ->
			if $scope.condition()
				elem.bind "click", (event) ->
					event.preventDefault()
					$scope.method id: attrs.val

$("#bottom-menu").hover (->
	$("#bottom-menu-img").animate
		width : parseInt($('#bottom-menu-content').css('width').replace(/[^-\d\.]/g, ''), 10) + 25
	, 500
	$("#bottom-menu-content").stop(1, 1).delay(500).animate
		opacity : 1
	, 500
), ->
	$("#bottom-menu-content").stop(1, 1).animate
		opacity : 0
	, 500
	$("#bottom-menu-img").delay(500).animate
		width : 36
	, 500
