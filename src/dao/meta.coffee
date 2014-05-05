fs = Quartz.lib.fs
md5 = Quartz.lib.utility.md5

meta = JSON.parse fs.readFileSync __dirname + '/../data/config/meta.json', null
meta.emailMD5 = md5 meta.adminEmail

module.exports = meta
