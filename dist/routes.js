var config,currentTheme,getCategory,meta,post,url;url=require("url"),post=require("./models/post"),getCategory=require("./models/archive"),meta=JSON.stringify(require("./dao/meta")),config=require("./data/config/config"),currentTheme="tanzaku",setInterval(function(){return currentTheme=config.themesList[parseInt(Math.random()*(config.themesList.length-1))]},36e5),exports.index=function(e,t){return e.url=url.parse(e.url,!0).pathname,"/public"!==e.url.substr(0,7)?t.sendfile("public/themes/"+currentTheme+"/index.html"):t.sendfile(e.url.substring(1),null,function(e){return e?t.sendfile("public/themes/"+currentTheme+"/index.html"):void 0})},exports.meta=function(e,t){return t.send(meta)},exports.post=function(e,t){var r;return r=post.getAllById(e.param("id")),r===!1?t.status(404).send():t.send(JSON.stringify(r[0]))},exports.multiPost=function(e,t){var r,n,s,i;return r=url.parse(e.url,!0).query,r.moreTag="true"===r.moreTag?!0:!1,n=post.getPropertiesByOrder(function(){i=[];for(var e=s=parseInt(r.offset,10),t=parseInt(r.offset+r.limit,10);t>=s?t>e:e>t;t>=s?e++:e--)i.push(e);return i}.apply(this),r.get,r.moreTag),t.send(n===!1?[]:JSON.stringify(n))},exports.archive=function(e,t){return t.send(JSON.stringify(getCategory(e.param("get"))))},exports.getPostsByCategories=function(e,t){var r,n;return r=url.parse(e.url,!0).query,r.offset=parseInt(r.offset,10),r.limit=parseInt(r.limit,10),r.moreTag="true"===r.moreTag?!0:!1,r.limit>config.maxPostPerRequest?t.status(404).send():(n=post.getPropertiesByCategory(e.param("category"),r.get,r.offset,r.limit,r.moreTag),t.send(n===!1?[]:JSON.stringify(n)))},exports.getPostsBySingleTag=function(e,t){var r,n;return r=url.parse(e.url,!0).query,r.offset=parseInt(r.offset,10),r.limit=parseInt(r.limit,10),r.moreTag="true"===r.moreTag?!0:!1,n=post.getPropertiesByTag(e.param("tag"),r.get,r.offset,r.limit,r.moreTag),t.send(n===!1?[]:JSON.stringify(n))},exports.getFavicon=function(e,t){return t.sendfile("public/favicon.ico")};