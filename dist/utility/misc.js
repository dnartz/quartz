var _;

_ = Quartz.lib._;


/**
  * 检查id数组的合法性
  * @param {number|number[]} ids 要检查的id数组
  * @return {number[]|boolean} 如果检查无误，则返回一个id的数组，否则返回false
 */

exports.idsCheck = function(ids) {
  if (ids === false) {
    return false;
  }
  if (_.isArray(ids) !== true) {
    ids = [ids];
  }
  return ids = ids.map(function(a) {
    return parseInt(a, 10);
  });
};


/**
  * 将普通字符串转换成HTML
  * @param {string} str 要转换的字符串
  * @return {XML|string} 转换后的HTML
 */

exports.plain2HTML = function(str) {
  return str.replace(/\t/g, "    ").replace(RegExp("  ", "g"), "&nbsp; ").replace(RegExp("  ", "g"), " &nbsp;").replace(/\r\n|\n|\r/g, "<br>");
};

exports.char2Bool = function(chr) {
  return chr === 'true';
};
