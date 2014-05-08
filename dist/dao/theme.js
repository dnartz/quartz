var rd, relative, themeList,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

rd = Quartz.lib.rd;

relative = Quartz.lib.path.relative;

themeList = [];

rd.eachDirSync(__dirname + '/../public/themes', function(f) {
  var rel;
  rel = relative(__dirname + '/../public/themes', f);
  if (rel.length > 0 && __indexOf.call(rel, '/') >= 0 !== true) {
    return themeList.push(rel);
  }
});

module.exports = themeList;
