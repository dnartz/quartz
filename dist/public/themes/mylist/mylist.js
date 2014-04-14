angular.module("quartz.theme",["quartz.config","ngRoute","infinite-scroll"]).config(["$routeProvider","routeUrls","maxPostsPerReq",function($routeProvider,routeUrls,maxPostsPerReq){return $routeProvider.when(routeUrls.HomePage,{controller:"MultiPostCtrl",resolve:{posts:function(MultiPostLoader){return MultiPostLoader({type:"Post",offset:0,limit:maxPostsPerReq,get:["id","tags","title","content","postDate"],moreTag:!0})},type:function(){return"Post"}},templateUrl:"multipost.html"}).when(routeUrls.Category,{controller:"MultiPostCtrl",resolve:{posts:function(MultiPostLoader){return MultiPostLoader({type:"Category",offset:0,limit:maxPostsPerReq,get:["id","tags","title","content","postDate"],moreTag:!0})},type:function(){return"Category"}},templateUrl:"multipost.html"}).when(routeUrls.Tag,{controller:"MultiPostCtrl",resolve:{posts:function(MultiPostLoader){return MultiPostLoader({type:"Tag",offset:0,limit:maxPostsPerReq,get:["id","tags","title","content","postDate"],moreTag:!0})},type:function(){return"Tag"}},templateUrl:"multipost.html"}).when(routeUrls.Single,{controller:"PostCtrl",resolve:{post:function(PostLoader){return PostLoader()}},templateUrl:"/public/themes/mylist/post.html"}).when(routeUrls.Archive,{controller:"ArchiveCtrl",resolve:{archive:function(ArchiveLoader){return ArchiveLoader(["id","title","postDate"],!0)}},templateUrl:"/public/themes/mylist/archive.html"}).when(routeUrls[404],{resolve:{t:function(NotFoundLoader){return NotFoundLoader()}},controller:"NotFoundCtrl",templateUrl:"/public/themes/mylist/404.html"}).otherwise({redirectTo:"/404"})}]).controller("MultiPostCtrl",["$rootScope","Post","MultiPostLoader","maxPostsPerReq","type",function($rootScope,Post,MultiPostLoader,maxPostsPerReq,type){return $rootScope.LoadMore=function(){return MultiPostLoader({type:type,offset:$rootScope.lastPostOrd,limit:maxPostsPerReq,get:["id","tags","title","content","postDate"],moreTag:!0}),$rootScope.allPostsLoaded?$rootScope.LoadMore=function(){}:void 0}}]).controller("PostCtrl",[function(){}]).controller("NotFoundCtrl",[function(){}]).controller("ArchiveCtrl",["$rootScope","archive","$scope",function($rootScope,archive,$scope){var key,months,post,val,_i,_j,_k,_len,_len1,_len2,_ref,_ref1,_ref2;$rootScope.categories=archive,$scope.tposts=[];for(key in archive)if("$"!==key[0])for(_ref=archive[key].posts,_i=0,_len=_ref.length;_len>_i;_i++)post=_ref[_i],$scope.tposts.push(post);for($scope.tposts.sort(function(a,b){return b.postDate-a.postDate}),_ref1=$scope.tposts,_j=0,_len1=_ref1.length;_len1>_j;_j++)val=_ref1[_j],val.postDate=new Date(val.postDate);for(months=["一月","二月","三月","四月","五月","六月","七月","八月","九月","十月","十一月","十二月"],_ref2=$scope.tposts,key=_k=0,_len2=_ref2.length;_len2>_k;key=++_k)val=_ref2[key],(0===key||val.postDate.getFullYear()!==$scope.tposts[key-1].postDate.getFullYear())&&($scope.tposts[key].year=val.postDate.getFullYear()),(0===key||months[val.postDate.getMonth()]!==months[$scope.tposts[key-1].postDate.getMonth()])&&($scope.tposts[key].month=months[val.postDate.getMonth()]);return $scope.curMonth=0}]).directive("focus",function(){return{link:function(scope,element){return element[0].focus()}}}),$(function(){return $("#bottom-menu").hover(function(){return $("#bottom-menu-img").animate({width:function(){var ret;return ret=parseInt($("#bottom-menu-content").css({display:"block",vvisibility:"none"}).css("width").slice(0,-1),10)+25,$("#bottom-menu-content").css("display","none").css("visibility","visible"),ret}()},500),$("#bottom-menu-content").delay(500).fadeIn(500)},function(){return $("#bottom-menu-content").fadeOut(500),$("#bottom-menu-img").delay(500).animate({width:36},500)})});