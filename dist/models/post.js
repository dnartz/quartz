var arrayIndex2PostId, categories, categoriesIndex, category, cutContent, fetchPropertiesById, idsAndPropertiesCheck, idsCheck, isEmptyArray, post, postFields, postIds, posts, postsIdIndex, propertiesCheck, tagsIndex, tagsList, that, _, _i, _j, _len, _len1,
  __slice = [].slice;

posts = Quartz.dao.post.posts;

postIds = posts.map(function(a) {
  return parseInt(a.id, 10);
});

postsIdIndex = Quartz.dao.post.postsIdIndex;

tagsIndex = Quartz.dao.post.tagsIndex;

tagsList = Quartz.dao.post.tags;

postFields = Quartz.config.system.postFields;

categories = Quartz.dao.category;

categoriesIndex = {};

for (_i = 0, _len = categories.length; _i < _len; _i++) {
  category = categories[_i];
  categoriesIndex[category] = [];
}

for (_j = 0, _len1 = posts.length; _j < _len1; _j++) {
  post = posts[_j];
  categoriesIndex[post.category].push(post);
}

cutContent = Quartz.lib.utility.post.cutContent;

_ = Quartz.lib._;


/**
  * 数组特殊辅助函数，去除数组中所有的false
  * @param {array} 数组
  * @return {array|boolean} 如果为空数组，那么返回false， 否则返回数组本身
 */

isEmptyArray = function(arr) {
  arr = _.without(arr, false);
  if (_.isEmpty(arr)) {
    return false;
  } else {
    return arr;
  }
};


/**
	* 根据提供的数组下标获取文章数组的文章id
  * @param {number|number[]} arr 数组下表
  * @return {number|number[]} 对于number表示的数组下标，返回一个对应的文章id
  *                           对于数组存放的数组下标，返回相应的文章id数组，如果没有匹配ID，则返回FALSE
 */

arrayIndex2PostId = function(arr) {
  if (_.isArray(arr) !== true) {
    arr = [arr];
  }
  return isEmptyArray(arr.map(function(a) {
    if (_.isObject(posts[a]) !== true) {
      return false;
    } else {
      return parseInt(posts[a].id, 10);
    }
  }));
};


/**
  * 检查查询的属性数组的合法性
  * @param {string[]} properties
  * @return {string[]|boolean} 返回格式规范化之后的属性数组，若操作失败，则返回false
 */

propertiesCheck = function(properties) {
  if (_.isArray(properties) !== true) {
    properties = [properties];
  }
  if (_.intersection(properties, postFields).length === 0) {
    return false;
  } else {
    return properties;
  }
};

idsCheck = Quartz.lib.utility.misc.idsCheck;


/**
  * 检查文章Id的和要查询的属性数组的合法性
  * @param {fcuntion} 要操作的函数
 */

idsAndPropertiesCheck = function(fn) {
  return function() {
    var args, ids;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    if ((ids = idsCheck(args[0])) === false) {
      return false;
    }
    args[1] = propertiesCheck(args[1]);
    if (_.intersection(ids, postIds).length === 0 || args[1] === false) {
      return false;
    }
    return fn != null ? fn.apply(that, [ids].concat(args.slice(1))) : void 0;
  };
};


/**
  * 按照文章id以及提供的属性数组来获取文章的属性
  * @param {number} id 文章的id
  * @param {string[]} properties 要获取的属性数组
  * @param {boolean} [moreTag] 是否只获取More Tag之前的内容，默认为false
  * @return {object|boolean} post 如果成功，就返回一个文章对象，否则返回false
 */

fetchPropertiesById = function(id, properties, moreTag) {
  var property, ret, _k, _len2;
  if (_.isUndefined(postsIdIndex[id])) {
    return false;
  }
  ret = {};
  for (_k = 0, _len2 = properties.length; _k < _len2; _k++) {
    property = properties[_k];
    ret[property] = postsIdIndex[id][property];
    if (property === 'content') {
      ret.content = cutContent(ret.content, moreTag);
      ret.moreTag = !(ret.content === postsIdIndex[id]['content']);
    }
  }
  return ret;
};

module.exports = {

  /**
  		* 获取一篇或多篇文章的某一特定属性
  		* @params {number|number[]} id 文章id
  		* @params {string|string[]} properties 查询的属性
  		* @param {boolean} [moreTag] 是否只获取More Tag之前的内容，默认为false
  		* @return {array} 返回带有所求属性的数组
   */
  getPropertiesById: idsAndPropertiesCheck(function(ids, properties, moreTag) {
    if (moreTag == null) {
      moreTag = false;
    }
    return isEmptyArray(ids.map(function(id) {
      return fetchPropertiesById(id, properties, moreTag);
    }));
  }),

  /**
  		* 获取指定分类下的所有文章
  		* @param {string|string[]} categories 要获取的分类名称
  		* @param {string|string[]} properties 查询的属性
  		* @param {number} [offset] 文章数组起始的偏移，只有当categories只有一个且提供了limit时才生效
  		* @param {number} [limit] 获取文章的长度，只有当categories只有一个且提供了offset时才生效
  		* @param {boolean} [moreTag] 是否只获取More Tag之前的内容，默认为false
  		* @return {array|boolean} 返回一个按文章类别分类的数组，如果没有查询到任何文章，就返回false
  		*                         如果只查询一个分类的文章，那么只返回一个该分类文章的数组
   */
  getPropertiesByCategory: function(categoriesArr, properties, offset, limit, moreTag) {
    var key, ret, val, _k, _l, _len2, _len3, _ref;
    if (offset == null) {
      offset = null;
    }
    if (limit == null) {
      limit = null;
    }
    if (moreTag == null) {
      moreTag = false;
    }
    if ((properties = propertiesCheck(properties)) === false) {
      return false;
    }
    if (_.isArray(categoriesArr) !== true) {
      categoriesArr = [categoriesArr];
    }
    if ((categoriesArr = _.intersection(categoriesArr, categories)).length === 0) {
      return false;
    }
    if (categoriesArr.length === 1 && (offset < 0 || limit < 1)) {
      return false;
    }
    ret = [];
    for (_k = 0, _len2 = categoriesArr.length; _k < _len2; _k++) {
      val = categoriesArr[_k];
      ret.push({
        name: val,
        posts: []
      });
    }
    for (_l = 0, _len3 = ret.length; _l < _len3; _l++) {
      val = ret[_l];
      _ref = categoriesIndex[val.name];
      for (key in _ref) {
        post = _ref[key];
        if (categoriesArr.length === 1 && offset >= 0 && limit > 0 && key >= offset || categoriesArr.length > 1) {
          val.posts.push(fetchPropertiesById(post.id, properties, moreTag));
          if (categoriesArr.length === 1 && val.posts.length >= limit) {
            break;
          }
        }
      }
    }
    if (_.isEmpty(ret)) {
      return false;
    } else {
      if (categoriesArr.length === 1) {
        ret = ret[0].posts;
      }
      return ret;
    }
  },

  /**
  		* 通过标签查询多篇文章
  		* @param {string|string[]} 要查询的标签
  		* @param {string|string[]} 要查询的文章属性
  		* @param {number|null} [offset] 文章起始编号，只提供一个标签时才有效
  		* @param {number|null} [limit] 文章起始编号，只提供一个标签时才有效
  		* @param {boolean} [moreTag] 是否只获取More Tag之前的内容，默认为false
  		* @return {array|object|boolean} 如果只提供一个数组，那么只返回包含这个标签的文章数组，否则返回一个包含各种标签的对象，
  																		 如果操作失败，则返回false
   */
  getPropertiesByTag: function(tags, properties, offset, limit, moreTag) {
    var key, ret, tag, _k, _l, _len2, _len3, _ref;
    if (offset == null) {
      offset = null;
    }
    if (limit == null) {
      limit = null;
    }
    if (moreTag == null) {
      moreTag = false;
    }
    if (_.isArray(tags) !== true) {
      tags = [tags];
    }
    tags = _.intersection(tags, tagsList);
    if (tags.length === 0) {
      return false;
    }
    if ((properties = propertiesCheck(properties)) === false) {
      return false;
    }
    ret = {};
    for (_k = 0, _len2 = tags.length; _k < _len2; _k++) {
      tag = tags[_k];
      ret[tag] = [];
      _ref = tagsIndex[tag];
      for (key = _l = 0, _len3 = _ref.length; _l < _len3; key = ++_l) {
        post = _ref[key];
        if (tags.length === 1 && offset >= 0 && limit > 0 && ret[tag].length < limit && key >= offset || tags.length > 1) {
          ret[tag].push(this.getPropertiesById(post.id, properties, moreTag)[0]);
          if (tags.length === 1 && offset >= 0 && limit > 0 && ret[tag].length === limit) {
            break;
          }
        }
      }
    }
    if (tags.length === 1) {
      ret = ret[tags[0]];
    }
    return ret;
  },

  /**
  		* 获取指定文章的所有信息
  		* @param {number|number[]} id 文章id
  		* @param {boolean} [moreTag] 是否只读取到More标记处，默认为false
   */
  getAllById: function(ids, moreTag) {
    if (moreTag == null) {
      moreTag = false;
    }
    if ((ids = idsCheck(ids)) === false) {
      return false;
    }
    return isEmptyArray(ids.map(function(id) {
      var ret;
      if (_.isObject(postsIdIndex[id]) !== true) {
        return false;
      }
      ret = _.extend({
        moreTag: moreTag
      }, postsIdIndex[id]);
      if (moreTag) {
        ret.content = cutContent(ret.content, moreTag);
      }
      return ret;
    }));
  },

  /**
  		* 以数组下标形式调用的API
   */
  getPropertiesByOrder: function(ords, properties, moreTag) {
    if (moreTag == null) {
      moreTag = false;
    }
    return this.getPropertiesById(arrayIndex2PostId(ords), properties, moreTag);
  },
  getAllByOrder: function(ords, moreTag) {
    if (moreTag == null) {
      moreTag = false;
    }
    return this.getAllById(arrayIndex2PostId(ords), moreTag);
  }
};

that = module.exports;
