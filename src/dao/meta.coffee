fs = require 'fs'
md5 = require __dirname + '/../utility/md5'

meta = JSON.parse fs.readFileSync __dirname + '/../data/config/meta.json', null
meta.emailMD5 = md5 meta.adminEmail

module.exports = meta
