###*
  * 截取文章内容
  * @param {string} content 文章的内容
  * @param {boolean} [moreTag] 是否只截取moreTag之前的内容
  * @return {string} 被截取的文章内容
###
exports.cutContent = (content, moreTag = false)->
	ret = content

	if moreTag is true
		moreTagIndex = ret.indexOf '<!--more-->'
		# 如果moreTag为真，就进行相应处理
		if moreTagIndex isnt -1 then ret = ret.substring 0, moreTagIndex

	return ret
