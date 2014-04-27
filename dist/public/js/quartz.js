var quartzConfig,quartzService;angular.module("quartz",["quartz.services","quartz.config","quartz.theme","ngSanitize"]).config(["$locationProvider",function($locationProvider){return $locationProvider.html5Mode(!0)}]).run(["$rootScope","$route","$http","routeUrls",function($rootScope,$route,$http,routeUrls){return $http.get("/api/meta").success(function(data){return _.isObject($rootScope.meta)!==!0&&($rootScope.meta={}),$rootScope.meta=_.extend($rootScope.meta,data)}),$rootScope.$on("$routeChangeSuccess",function(e,currentRoute){return currentRoute=currentRoute.$$route.originalPath,$rootScope.meta.isHomePage=currentRoute===routeUrls.HomePage,$rootScope.meta.isSinglePost=currentRoute===routeUrls.Single,$rootScope.meta.is404=currentRoute===routeUrls[404],$rootScope.meta.isArchive=currentRoute===routeUrls.Archive,$rootScope.meta.isCategory=currentRoute===routeUrls.Category,$rootScope.meta.isTagPage=currentRoute===routeUrls.Tag})}]),quartzService=angular.module("quartz.services",["ngResource","ngRoute"]).service("titleFn",["$rootScope","$route",function($rootScope,$route){return function(type){return $rootScope.meta.title={Post:function(){return $rootScope.post.title+" | "+$rootScope.meta.blogName},HomePage:function(){return $rootScope.meta.blogName+" | "+$rootScope.meta.blogDescription},Category:function(){return"» "+$route.current.params.category+" | "+$rootScope.meta.blogName},Tag:function(){return"» "+$route.current.params.tag+" | "+$rootScope.meta.blogName},Archive:function(){return"» 所有文章 | "+$rootScope.meta.blogName},404:function(){return"404 | "+$rootScope.meta.blogName}}[type]()}}]),quartzService.factory("Post",["$resource",function($resource){return $resource("/api/p/:id",{id:"@id"})}]).factory("MultiPostLoader",["Post","Category","Tag","$rootScope","$q","$route","titleFn",function(Post,Category,Tag,$rootScope,$q,$route,titleFn){var prevCategory,prevTag,prevType;return prevType="",prevTag="",prevCategory="",function(args){var delay,ttyp,typ;if(delay=$q.defer(),typ={Post:Post,Category:Category,Tag:Tag}[args.type],ttyp=($route.current.$$route.orginalPath="/")?"HomePage":args.type,prevType!==args.type||prevTag!==$route.current.params.tag||prevCategory!==$route.current.params.category)prevType=args.type,prevTag=$route.current.params.tag,prevCategory=$route.current.params.category,$rootScope.posts=[];else if($rootScope.posts.length>args.offset)return delay.resolve($rootScope.posts),delay.promise;return delete args.type,typ===Category&&(args.category=$route.current.params.category),typ===Tag&&(args.tag=$route.current.params.tag),typ.query(args,function(posts){return _.isUndefined(ttyp)&&(ttyp="HomePage"),titleFn(ttyp),$rootScope.posts=0===$rootScope.posts.length?posts:$rootScope.posts.concat(posts),0===posts.length&&($rootScope.allPostsLoaded=!0),$rootScope.lastPostOrd=$rootScope.posts.length,delay.resolve(posts)},function(){return delay.reject("Unable to Fetch posts")}),delay.promise}}]),quartzService.factory("PostLoader",["Post","$q","$route","$rootScope","titleFn",function(Post,$q,$route,$rootScope,titleFn){return function(){var delay;return delay=$q.defer(),Post.get({id:$route.current.params.id},function(post){return post.title!==$route.current.params.title&&(window.location="/404"),$rootScope.post=post,titleFn("Post"),delay.resolve(post)},function(){return delay.reject("Unable to fetch post "+$route.current.params.id)}),delay.promise}}]),quartzService.factory("Category",["$resource",function($resource){return $resource("/api/category/:category",{category:"@category"})}]),quartzService.factory("Tag",["$resource",function($resource){return $resource("/api/tag/:tag",{tag:"@tag"})}]),quartzService.factory("Archive",["$resource",function($resource){return $resource("/api/archive",{})}]).factory("ArchiveLoader",["$rootScope","Archive","$q","titleFn",function($rootScope,Archive,$q,titleFn){return function(properties,moreTag){var delay;return null==moreTag&&(moreTag=!1),delay=$q.defer(),Archive.get({get:properties,moreTag:moreTag},function(archive){return titleFn("Archive"),delay.resolve(archive)},function(){return delay.reject("Unable to fetch archive")}),delay.promise}}]),quartzService.factory("Comment",["$resource",function($resource){return $resource("/api/comment/p/:id",{id:"@id"})}]),quartzService.factory("CommentLoader",["$rootScope","$q","Comment",function($rootScope,$q,Comment){return function(args){var delay;return delay=$q.defer(),Comment.get({postId:args.id,offset:args.offset,limit:args.limit,get:args.properties},function(comments){return delay.resolve(comments)},function(){return delay.reject("Unable to fetch comments")})}}]),quartzService.factory("NotFoundLoader",["$rootScope","$interval","$q","titleFn",function($rootScope,$interval,$q,titleFn){return function(){var delay,interv;return delay=$q.defer(),interv=$interval(function(){return _.isObject($rootScope.meta)&&$rootScope.meta.hasOwnProperty("blogName")?(titleFn("404"),delay.resolve(404),$interval.cancel(interv)):void 0},10),delay.promise}}]),quartzConfig=angular.module("quartz.config",[]).constant("routeUrls",{HomePage:"/",404:"/404",Archive:"/archive",Category:"/category/:category",Single:"/:id/:title",Tag:"/tag/:tag"}).constant("maxPostsPerReq",15);