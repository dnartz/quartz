var commentFields, comments, idsCheck, maxCommentId, md5, minCommentInterval, plain2HTML, postComments, postsIdIndex, validator, writeFile, xssClean, _,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

_ = Quartz.lib._;

writeFile = Quartz.lib.fs.writeFile;

postsIdIndex = Quartz.dao.post.postsIdIndex;

comments = Quartz.dao.comment.comments;

postComments = Quartz.dao.comment.postComments;

maxCommentId = Quartz.dao.comment.maxCommentId;

commentFields = Quartz.config.system.commentFields;

minCommentInterval = Quartz.config.system.minCommentInterval;

minCommentInterval *= 1000;

idsCheck = Quartz.lib.utility.misc.idsCheck;

plain2HTML = Quartz.lib.utility.misc.plain2HTML;

md5 = Quartz.lib.utility.md5;

validator = Quartz.lib.validator;

xssClean = Quartz.lib.sanitizer.sanitize;

module.exports = {

  /**
  		* 通过评论id获取一条评论的所有信息
  		* @param number id 要获取的评论id
  		* @return object|boolean 如果成功，就返回包括评论所有信息的对象，否则返回false
   */
  getCommentById: function(id) {
    if (comments[parseInt(id, 10)] != null) {
      return comments[parseInt(id, 10)];
    } else {
      return false;
    }
  },

  /**
  		* 按照文章id获取文章评论
  		* @param {number[]|number} ids 要获取的评论的文章id
  		* @param {string[]|string} properties 要获取的评论的属性
  		* @param {number} offset 从第几篇评论开始
  		* @param {number} limit 取多少篇评论
  		* @return {object|array|boolean} 如果成功，就返回评论内容。
   																 如果只提供了一个文章id，那么就只返回这篇文章的评论的数组，否则返回一个以文章id为索引的对象
   */
  getCommentsByPostId: function(ids, properties, offset, limit) {
    var comment, id, key, property, ret, _i, _j, _len, _len1, _ref;
    if ((ids = idsCheck(ids)) === false) {
      return false;
    }
    if (_.isArray(properties) !== true) {
      properties = [properties];
    }
    properties = _.intersection(commentFields, properties);
    if (properties.length < 1) {
      return false;
    }
    ret = {};
    for (_i = 0, _len = ids.length; _i < _len; _i++) {
      id = ids[_i];
      if (_.isUndefined(postComments[id]) !== true) {
        ret[id] = [];
        _ref = postComments[id];
        for (key = _j = 0, _len1 = _ref.length; _j < _len1; key = ++_j) {
          comment = _ref[key];
          if (ids.length !== 1 || !(offset != null) || !(limit != null) || offset <= key && ret[id].length < limit) {
            ret[id].push({});
            for (property in comment) {
              if (__indexOf.call(properties, property) >= 0) {
                _.last(ret[id])[property] = postComments[id][key][property];
              }
            }
          }
        }
      }
    }
    if (ids.length === 1) {
      ret = ret[ids[0]];
    }
    return ret;
  },

  /**
  		* 添加新评论
  		* @param comment 评论参数，包括author,authorIp,authorAgent,authorEmail,
  		*                authorHomePage（可选）,postId,content,lastComment
   	* @return {*} 返回一个表示操作结果的对象，包括status（HTTP状态码）,msg（返回信息）
   */
  addPostComment: function(comment) {
    var e, field;
    if ((Date.now() - comment.lastComment) < minCommentInterval) {
      return {
        status: 403,
        msg: '请不要短时间内发表太多评论。'
      };
    }
    for (field in comment) {
      comment[field] = xssClean(comment[field]);
    }
    try {
      comment.postId = parseInt(comment.postId, 10);
      if (_.isUndefined(postsIdIndex[comment.postId])) {
        throw '找不到这篇文章。';
      }
      if (validator.isNull(comment.content)) {
        throw '空的评论内容。';
      }
      if (validator.isEmail(comment.authorEmail) !== true) {
        throw '非法的Email格式。';
      }
      if (validator.isIP(comment.authorIp) !== true) {
        throw '非法的IP地址。';
      }
      if (comment.authorHomePage.indexOf('http://') !== -1 && validator.isURL(comment.authorHomePage) !== true) {
        throw '非法的个人主页URL。';
      }
    } catch (_error) {
      e = _error;
      return {
        status: 400,
        msg: e
      };
    }
    comment.content = plain2HTML(comment.content);
    comment.authorEmailMD5 = md5(comment.authorEmail);
    comment.commentDate = Date.now();
    comment.id = ++maxCommentId;
    writeFile(__dirname + ("/../data/comments/" + comment.id + ".json"), JSON.stringify(comment), function(err) {
      if (err) {
        return console.log(err);
      }
    });
    postsIdIndex[comment.postId].commentCount++;
    comments[comment.id] = comment;
    if (_.isArray(postComments[comment.postId])) {
      postComments[comment.postId].push(comment);
    } else {
      postComments[comment.postId] = [comment];
    }
    return {
      status: 200,
      msg: '评论发表成功。',
      comment: comment
    };
  }
};
