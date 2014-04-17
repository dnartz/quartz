fs = require 'fs'

{posts} = require './post'

categories = []

(if categories.indexOf(post.category) is -1 then categories.push post.category) for post in posts

module.exports = categories

fs.writeFile(__dirname + '/../data/categories.json', JSON.stringify(categories), {encoding : 'utf-8', flag : 'w'}, ->)