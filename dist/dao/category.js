var categories, fs, post, posts, _i, _len;

fs = Quartz.lib.fs;

posts = Quartz.dao.post.posts;

categories = [];

for (_i = 0, _len = posts.length; _i < _len; _i++) {
  post = posts[_i];
  if (categories.indexOf(post.category) === -1) {
    categories.push(post.category);
  }
}

module.exports = categories;

fs.writeFile(__dirname + '/../data/categories.json', JSON.stringify(categories), {
  encoding: 'utf-8',
  flag: 'w'
}, function() {});
