var JSONList,filename,fs,path,post,posts,postsIdIndex,rd,tag,tags,tagsIndex,_,_i,_j,_k,_len,_len1,_len2,_ref;for(rd=require("rd"),fs=require("fs"),path=require("path"),_=require("underscore")._,posts=[],postsIdIndex={},JSONList=[],rd.eachSync(__dirname+"/../data/posts",function(s){return".json"===path.extname(s)?JSONList.push(s):void 0}),_i=0,_len=JSONList.length;_len>_i;_i++)filename=JSONList[_i],posts.push(JSON.parse(fs.readFileSync(filename,null))),_.last(posts).id=parseInt(_.last(posts).id,10),postsIdIndex[_.last(posts).id]=_.last(posts);for(posts.sort(function(s,t){return t.postDate-s.postDate}),tags=[],tagsIndex={},_j=0,_len1=posts.length;_len1>_j;_j++)for(post=posts[_j],_ref=post.tags,_k=0,_len2=_ref.length;_len2>_k;_k++)tag=_ref[_k],_.isArray(tagsIndex[tag])!==!0&&(tagsIndex[tag]=[]),tagsIndex[tag].indexOf(posts)&&tagsIndex[tag].push(post),-1===tags.indexOf(tag)&&tags.push(tag);exports.posts=posts,exports.postsIdIndex=postsIdIndex,exports.tagsIndex=tagsIndex,exports.tags=tags;