var JSONList, filename, fs, path, post, posts, postsIdIndex, rd, tag, tags, tagsIndex, _, _i, _j, _k, _len, _len1, _len2, _ref;

rd = Quartz.lib.rd;

fs = Quartz.lib.fs;

path = Quartz.lib.path;

_ = Quartz.lib._;

posts = [];

postsIdIndex = {};

JSONList = [];

rd.eachSync(__dirname + '/../data/posts', function(f) {
  if ('.json' === path.extname(f)) {
    return JSONList.push(f);
  }
});

for (_i = 0, _len = JSONList.length; _i < _len; _i++) {
  filename = JSONList[_i];
  posts.push(JSON.parse(fs.readFileSync(filename)));
  _.last(posts).id = parseInt(_.last(posts).id, 10);
  postsIdIndex[_.last(posts).id] = _.last(posts);
  _.last(posts).commentCount = 0;
}

posts.sort(function(a, b) {
  return b.postDate - a.postDate;
});

tags = [];

tagsIndex = {};

for (_j = 0, _len1 = posts.length; _j < _len1; _j++) {
  post = posts[_j];
  _ref = post.tags;
  for (_k = 0, _len2 = _ref.length; _k < _len2; _k++) {
    tag = _ref[_k];
    if (_.isArray(tagsIndex[tag]) !== true) {
      tagsIndex[tag] = [];
    }
    if (tagsIndex[tag].indexOf(posts)) {
      tagsIndex[tag].push(post);
    }
    if (tags.indexOf(tag) === -1) {
      tags.push(tag);
    }
  }
}


/**
  * @property {object[]} posts 按发表日期从新到旧排列的文章数组
 */

exports.posts = posts;


/**
  * @property {object} postsIdIndex 以文章id为属性名的索引
 */

exports.postsIdIndex = postsIdIndex;


/**
  * @property {object} tags 各标签下的索引
 */

exports.tagsIndex = tagsIndex;

exports.tags = tags;
