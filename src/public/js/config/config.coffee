# 博客系统的常量以及变量初始化
quartzConfig.constant('routeUrls', {
	HomePage : '/'
	"404" : '/404'
	Archive : '/archive'
	Category : '/category/:category'
	Single : '/:id/:title'
	Tag : '/tag/:tag'
}).constant 'maxPostsPerReq', 15