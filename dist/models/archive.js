var categories, cutContent, key, post, postFields, posts, val, _, _i, _j, _len, _len1;

_ = Quartz.lib._._;

postFields = Quartz.config.system.postFields;

cutContent = Quartz.lib.utility.post.cutContent;

categories = Quartz.dao.category.reduce(function(prev, a) {
  if (_.isArray(prev) !== true) {
    prev = [];
  }
  prev.push({
    name: a,
    posts: [],
    postCount: 0
  });
  return prev;
});

posts = Quartz.dao.post.posts;

for (_i = 0, _len = posts.length; _i < _len; _i++) {
  post = posts[_i];
  for (key = _j = 0, _len1 = categories.length; _j < _len1; key = ++_j) {
    val = categories[key];
    if (val.name === post.category) {
      categories[key].postCount++;
      categories[key].posts.push(post);
    }
  }
}


/**
  * 获取文章分类，以及各分类包含的文章的属性
  * @param {string[]} Fields 要获取的文章的属性数组
  * @param {boolean} [moreTag] 是否不获取moreTag之后的内容
 */

module.exports = function(Fields, moreTag) {
  var category, filed, ret, _k, _l, _len2, _len3, _len4, _m, _ref;
  if (moreTag == null) {
    moreTag = false;
  }
  Fields = _.intersection(Fields, postFields);
  ret = {};
  for (_k = 0, _len2 = categories.length; _k < _len2; _k++) {
    category = categories[_k];
    ret[category.name] = {};
    ret[category.name].name = category.name;
    ret[category.name].posts = [];
    _ref = category.posts;
    for (_l = 0, _len3 = _ref.length; _l < _len3; _l++) {
      post = _ref[_l];
      ret[category.name].posts.push({});
      for (_m = 0, _len4 = Fields.length; _m < _len4; _m++) {
        filed = Fields[_m];
        if (filed === 'content') {
          _.last(ret[category.name].posts)[filed] = cutContent(post[filed], moreTag);
        } else {
          _.last(ret[category.name].posts)[filed] = post[filed];
        }
      }
    }
  }
  return ret;
};
