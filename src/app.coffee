# 初始化全局变量
global.Quartz = {}
require './Quartz'

express = Quartz.lib.express
routes = Quartz.routes
http = Quartz.lib.http
path = Quartz.lib.path
app = express()

# all environments
app.set "port", process.env.PORT or 3000
app.use express.logger "dev"
app.use express.json()
app.use express.urlencoded()
app.use express.methodOverride()
app.use express.bodyParser()

# XSRF防护
app.use express.cookieParser 'PfMoTk6BsJUi59QlINpgbwwIrNQZHV27'
app.use express.session()
app.use express.csrf(value : (req)-> return req.headers['x-xsrf-token'])
app.use (req, res, next)->
	res.cookie 'XSRF-TOKEN', req.csrfToken()
	next()

app.use app.router

app.use express.static path.join(__dirname, "public")

# development only
app.use '/public', express.errorHandler() if "development" is app.get "env"

# 路由表
# 获取基本配置
app.get '/api/meta', routes.meta

# 获取文章
app.get '/api/p', routes.multiPost
app.get '/api/p/:id(\\d+)', routes.post

# 按照标签来索引文章
app.get '/api/tag/:tag', routes.getPostsBySingleTag

# 按照文章分类获取文章
app.get '/api/category/:category', routes.getPostsByCategories

# 按照评论ID获取评论
app.get '/api/comment/:id',routes.getCommentById

# 按照文章ID获取评论
app.get '/api/comment/p/:id', routes.getCommentsByPostId

# 按照文章ID添加评论
app.post '/api/comment', routes.addPostComment

# 获取文章存档
app.get '/api/archive', routes.archive

# 获取favicon
app.get '/favicon.ico*', routes.getFavicon

app.get '*', routes.index

# 启动服务器
http.createServer(app).listen app.get("port"), ->
	console.log "Express server listening on port " + app.get("port")