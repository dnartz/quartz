rd = Quartz.lib.rd
{relative} = Quartz.lib.path

themeList = []

rd.eachDirSync __dirname + '/../public/themes', (f)->
	rel = relative __dirname + '/../public/themes', f
	if rel.length > 0 and '/' in rel isnt true then themeList.push rel

module.exports = themeList