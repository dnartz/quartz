_ = Quartz.lib._

###*
  * 检查id数组的合法性
  * @param {number|number[]} ids 要检查的id数组
  * @return {number[]|boolean} 如果检查无误，则返回一个id的数组，否则返回false
###
exports.idsCheck = (ids)->
	if ids is false then return false
	if _.isArray(ids) isnt true then ids = [ids]
	ids = ids.map (a)->
		parseInt a, 10 # 将所有元素都转换成number型

###*
  * 将普通字符串转换成HTML
  * @param {string} str 要转换的字符串
  * @return {XML|string} 转换后的HTML
###
exports.plain2HTML = (str)->
	return str.replace(/\t/g, "    ").replace(RegExp("  ", "g"), "&nbsp; ").replace(RegExp("  ", "g"),
		" &nbsp;").replace(/\r\n|\n|\r/g, "<br>")

# 将字符串转换成布尔型
exports.char2Bool = (chr)-> return chr is 'true'
