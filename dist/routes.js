// Generated by CoffeeScript 1.7.1
var comment, config, currentTheme, getCategory, meta, post, url, _;

url = require('url');

_ = require('underscore')._;

post = require('./models/post');

comment = require('./models/comment');

getCategory = require('./models/archive');

meta = JSON.stringify(require('./dao/meta'));

config = require('./data/config/config');

currentTheme = 'mylist';

setInterval(function() {
  return currentTheme = config.themesList[parseInt(Math.random() * (config.themesList.length - 1))];
}, 3600000);

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

exports.meta = function(req, res) {
  return res.send(meta);
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

exports.multiPost = function(req, res) {
  var query, ret, _i, _ref, _ref1, _results;
  query = (url.parse(req.url, true)).query;
  if (query.moreTag === 'true') {
    query.moreTag = true;
  } else {
    query.moreTag = false;
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
};

exports.archive = function(req, res) {
  return res.send(JSON.stringify(getCategory(req.param('get'))));
};

exports.getPostsByCategories = function(req, res) {
  var query, result;
  query = (url.parse(req.url, true)).query;
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
  if (query.moreTag === 'true') {
    query.moreTag = true;
  } else {
    query.moreTag = false;
  }
  if (query.limit > config.maxPostPerRequest) {
    return res.status(404).send();
  } else {
    result = post.getPropertiesByCategory(req.param('category'), query.get, query.offset, query.limit, query.moreTag);
    if (result === false) {
      return res.send([]);
    } else {
      return res.send(JSON.stringify(result));
    }
  }
};

exports.getPostsBySingleTag = function(req, res) {
  var query, result;
  query = (url.parse(req.url, true)).query;
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
  if (query.moreTag === 'true') {
    query.moreTag = true;
  } else {
    query.moreTag = false;
  }
  result = post.getPropertiesByTag(req.param('tag'), query.get, query.offset, query.limit, query.moreTag);
  if (result === false) {
    return res.send([]);
  } else {
    return res.send(JSON.stringify(result));
  }
};

exports.getCommentById = function(req, res) {
  var ret;
  ret = comment.getCommentById(req.param('id'));
  if (ret === false) {
    return res.status(404).send();
  } else {
    return res.send(JSON.stringify(ret));
  }
};

exports.getCommentsByPostId = function(req, res) {
  var query, ret;
  query = (url.parse(req.url, true)).query;
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
  ret = comment.getCommentsByPostId(req.param('id'), query.get, query.offset, query.limit);
  if (ret === false) {
    return res.status(404).send();
  } else {
    return res.send(JSON.stringify(ret));
  }
};

exports.getFavicon = function(req, res) {
  return res.sendfile('public/favicon.ico');
};
