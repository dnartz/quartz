
/**
  * 截取文章内容
  * @param {string} content 文章的内容
  * @param {boolean} [moreTag] 是否只截取moreTag之前的内容
  * @return {string} 被截取的文章内容
 */
exports.cutContent = function(content, moreTag) {
  var moreTagIndex, ret;
  if (moreTag == null) {
    moreTag = false;
  }
  ret = content;
  if (moreTag) {
    moreTagIndex = ret.indexOf('<!--more-->');
    if (moreTagIndex !== -1) {
      ret = ret.substring(0, moreTagIndex);
    }
  }
  return ret;
};
