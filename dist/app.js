var app, express, http, path, routes;

global.Quartz = {};

require('./Quartz');

express = Quartz.lib.express;

routes = Quartz.routes;

http = Quartz.lib.http;

path = Quartz.lib.path;

app = express();

app.set("port", process.env.PORT || 3000);

app.use(express.logger("dev"));

app.use(express.json());

app.use(express.urlencoded());

app.use(express.methodOverride());

app.use(express.bodyParser());

app.use(express.cookieParser('PfMoTk6BsJUi59QlINpgbwwIrNQZHV27'));

app.use(express.session());

app.use(express.csrf({
  value: function(req) {
    return req.headers['x-xsrf-token'];
  }
}));

app.use(function(req, res, next) {
  res.cookie('XSRF-TOKEN', req.csrfToken());
  return next();
});

app.use(app.router);

app.use(express["static"](path.join(__dirname, "public")));

if ("development" === app.get("env")) {
  app.use('/public', express.errorHandler());
}

app.get('/api/p', routes.multiPost);

app.get('/api/p/:id(\\d+)', routes.post);

app.get('/api/tag/:tag', routes.getPostsBySingleTag);

app.get('/api/category/:category', routes.getPostsByCategories);

app.get('/api/comment/:id', routes.getCommentById);

app.get('/api/comment/p/:id', routes.getCommentsByPostId);

app.post('/api/comment', routes.addPostComment);

app.get('/api/archive', routes.archive);

app.get('/favicon.ico*', routes.getFavicon);

app.get('*', routes.index);

http.createServer(app).listen(app.get("port"), function() {
  return console.log("Express server listening on port " + app.get("port"));
});
