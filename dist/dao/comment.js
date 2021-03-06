var JSONList, comments, filename, fs, maxCommentId, path, postComments, postId, postsIdIndex, rd, unit, _, _i, _len;

fs = Quartz.lib.fs;

rd = Quartz.lib.rd;

path = Quartz.lib.path;

_ = Quartz.lib._;

postsIdIndex = Quartz.dao.post.postsIdIndex;

comments = {};

postComments = {};

maxCommentId = 0;

JSONList = [];

rd.eachSync(__dirname + '/../data/comments', function(f) {
  if ('.json' === path.extname(f)) {
    return JSONList.push(f);
  }
});

for (_i = 0, _len = JSONList.length; _i < _len; _i++) {
  filename = JSONList[_i];
  unit = JSON.parse(fs.readFileSync(filename));
  comments[unit.id] = unit;
  postsIdIndex[unit.postId].commentCount++;
  if (unit.id > maxCommentId) {
    maxCommentId = unit.id;
  }
  if (_.isArray(postComments[unit.postId])) {
    postComments[unit.postId].push(unit);
  } else {
    postComments[unit.postId] = [unit];
  }
}

for (postId in postComments) {
  postComments[postId].sort(function(a, b) {
    return b.commentDate - a.commentDate;
  });
}

exports.comments = comments;

exports.postComments = postComments;

exports.maxCommentId = maxCommentId;
