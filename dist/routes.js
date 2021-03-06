var comment, config, currentTheme, getCategory, post, preTreatment, url, _;

url = Quartz.lib.url;

_ = Quartz.lib._;

post = Quartz.api.post;

comment = Quartz.api.comment;

getCategory = Quartz.api.archive;

config = Quartz.config.system;

currentTheme = 'none';

setInterval(function() {
  return currentTheme = config.themesList[parseInt(Math.random() * (config.themesList.length - 1))];
}, 3600000);

preTreatment = function(fn) {
  return function(req, res) {
    var query;
    query = (url.parse(req.url, true)).query;
    if (_.isUndefined(query.moreTag)) {
      query.moreTag = Quartz.lib.utility.misc.char2Bool(query.moreTag);
    }
    if (_.isUndefined(query.offset)) {
      query.offset = null;
    } else {
      query.offset = parseInt(query.offset, 10);
    }
    if (_.isUndefined(query.limit)) {
      query.limit = null;
    } else {
      query.limit = parseInt(query.limit, 10);
    }
    return fn(req, res, query);
  };
};

exports.index = function(req, res) {
  req.url = url.parse(req.url, true).pathname;
  if (req.url.substr(0, 7) !== '/public') {
    return res.sendfile("public/themes/" + currentTheme + "/index.html");
  } else {
    return res.sendfile(req.url.substring(1), null, function(err) {
      if (err) {
        return res.sendfile("public/themes/" + currentTheme + "/index.html");
      }
    });
  }
};

exports.post = function(req, res) {
  var result;
  result = post.getAllById(req.param('id'));
  if (result === false) {
    return res.status(404).send();
  } else {
    return res.send(JSON.stringify(result[0]));
  }
};

exports.multiPost = preTreatment(function(req, res, query) {
  var ret, _i, _ref, _ref1, _results;
  ret = post.getPropertiesByOrder((function() {
    _results = [];
    for (var _i = _ref = query.offset, _ref1 = query.offset + query.limit; _ref <= _ref1 ? _i < _ref1 : _i > _ref1; _ref <= _ref1 ? _i++ : _i--){ _results.push(_i); }
    return _results;
  }).apply(this), query.get, query.moreTag);
  if (ret === false) {
    return res.send([]);
  } else {
    return res.send(JSON.stringify(ret));
  }
});

exports.archive = function(req, res) {
  return res.send(JSON.stringify(getCategory(req.param('get'))));
};

exports.getPostsByCategories = preTreatment(function(req, res, query) {
  var result;
  if (query.limit > config.maxPostsPerReq) {
    return res.status(404).send();
  } else {
    result = post.getPropertiesByCategory(req.param('category'), query.get, query.offset, query.limit, query.moreTag);
    if (result === false) {
      return res.json([]);
    } else {
      return res.json(result);
    }
  }
});

exports.getPostsBySingleTag = preTreatment(function(req, res, query) {
  var result;
  result = post.getPropertiesByTag(req.param('tag'), query.get, query.offset, query.limit, query.moreTag);
  if (result === false) {
    return res.json([]);
  } else {
    return res.json(result);
  }
});

exports.getCommentById = function(req, res) {
  var ret;
  ret = comment.getCommentById(req.param('id'));
  if (ret === false) {
    return res.status(404).send();
  } else {
    return res.json(ret);
  }
};

exports.getCommentsByPostId = preTreatment(function(req, res, query) {
  var ret;
  ret = comment.getCommentsByPostId(req.param('id'), query.get, query.offset, query.limit);
  if (ret === false) {
    return res.status(404).send();
  } else {
    return res.json(ret);
  }
});

exports.addPostComment = function(req, res) {
  var ret;
  ret = comment.addPostComment({
    postId: parseInt(req.body.postId, 10),
    content: req.body.content,
    author: req.body.author,
    authorEmail: req.body.authorEmail,
    authorHomePage: req.body.authorHomePage,
    authorIp: req.headers['x-forwarded-for'] || req.ip,
    authorAgent: req.get('User-Agent'),
    lastComment: req.session.lastComment || 0
  });
  req.session.lastComment = Date.now();
  return res.status(ret.status).json(ret);
};

exports.getFavicon = function(req, res) {
  return res.sendfile('public/favicon.ico');
};
