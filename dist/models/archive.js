var categories,cutContent,key,post,postFileds,posts,val,_,_i,_j,_len,_len1;for(_=require("underscore")._,postFileds=require(__dirname+"/../data/config/config").postFileds,cutContent=require(__dirname+"/../utility/post").cutContent,categories=require(__dirname+"/../dao/category").reduce(function(e,t){return _.isArray(e)!==!0&&(e=[]),e.push({name:t,posts:[],postCount:0}),e}),posts=require(__dirname+"/../dao/post").posts,_i=0,_len=posts.length;_len>_i;_i++)for(post=posts[_i],key=_j=0,_len1=categories.length;_len1>_j;key=++_j)val=categories[key],val.name===post.category&&(categories[key].postCount++,categories[key].posts.push(post));module.exports=function(e,t){var o,s,n,r,i,a,p,l,u,c;for(null==t&&(t=!1),e=_.intersection(e,postFileds),n={},r=0,a=categories.length;a>r;r++)for(o=categories[r],n[o.name]={},n[o.name].name=o.name,n[o.name].posts=[],c=o.posts,i=0,p=c.length;p>i;i++)for(post=c[i],n[o.name].posts.push({}),u=0,l=e.length;l>u;u++)s=e[u],_.last(n[o.name].posts)[s]="content"===s?cutContent(post[s],t):post[s];return n};