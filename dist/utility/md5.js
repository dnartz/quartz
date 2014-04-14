function md5cycle(f,h){var i=f[0],r=f[1],n=f[2],d=f[3];i=ff(i,r,n,d,h[0],7,-680876936),d=ff(d,i,r,n,h[1],12,-389564586),n=ff(n,d,i,r,h[2],17,606105819),r=ff(r,n,d,i,h[3],22,-1044525330),i=ff(i,r,n,d,h[4],7,-176418897),d=ff(d,i,r,n,h[5],12,1200080426),n=ff(n,d,i,r,h[6],17,-1473231341),r=ff(r,n,d,i,h[7],22,-45705983),i=ff(i,r,n,d,h[8],7,1770035416),d=ff(d,i,r,n,h[9],12,-1958414417),n=ff(n,d,i,r,h[10],17,-42063),r=ff(r,n,d,i,h[11],22,-1990404162),i=ff(i,r,n,d,h[12],7,1804603682),d=ff(d,i,r,n,h[13],12,-40341101),n=ff(n,d,i,r,h[14],17,-1502002290),r=ff(r,n,d,i,h[15],22,1236535329),i=gg(i,r,n,d,h[1],5,-165796510),d=gg(d,i,r,n,h[6],9,-1069501632),n=gg(n,d,i,r,h[11],14,643717713),r=gg(r,n,d,i,h[0],20,-373897302),i=gg(i,r,n,d,h[5],5,-701558691),d=gg(d,i,r,n,h[10],9,38016083),n=gg(n,d,i,r,h[15],14,-660478335),r=gg(r,n,d,i,h[4],20,-405537848),i=gg(i,r,n,d,h[9],5,568446438),d=gg(d,i,r,n,h[14],9,-1019803690),n=gg(n,d,i,r,h[3],14,-187363961),r=gg(r,n,d,i,h[8],20,1163531501),i=gg(i,r,n,d,h[13],5,-1444681467),d=gg(d,i,r,n,h[2],9,-51403784),n=gg(n,d,i,r,h[7],14,1735328473),r=gg(r,n,d,i,h[12],20,-1926607734),i=hh(i,r,n,d,h[5],4,-378558),d=hh(d,i,r,n,h[8],11,-2022574463),n=hh(n,d,i,r,h[11],16,1839030562),r=hh(r,n,d,i,h[14],23,-35309556),i=hh(i,r,n,d,h[1],4,-1530992060),d=hh(d,i,r,n,h[4],11,1272893353),n=hh(n,d,i,r,h[7],16,-155497632),r=hh(r,n,d,i,h[10],23,-1094730640),i=hh(i,r,n,d,h[13],4,681279174),d=hh(d,i,r,n,h[0],11,-358537222),n=hh(n,d,i,r,h[3],16,-722521979),r=hh(r,n,d,i,h[6],23,76029189),i=hh(i,r,n,d,h[9],4,-640364487),d=hh(d,i,r,n,h[12],11,-421815835),n=hh(n,d,i,r,h[15],16,530742520),r=hh(r,n,d,i,h[2],23,-995338651),i=ii(i,r,n,d,h[0],6,-198630844),d=ii(d,i,r,n,h[7],10,1126891415),n=ii(n,d,i,r,h[14],15,-1416354905),r=ii(r,n,d,i,h[5],21,-57434055),i=ii(i,r,n,d,h[12],6,1700485571),d=ii(d,i,r,n,h[3],10,-1894986606),n=ii(n,d,i,r,h[10],15,-1051523),r=ii(r,n,d,i,h[1],21,-2054922799),i=ii(i,r,n,d,h[8],6,1873313359),d=ii(d,i,r,n,h[15],10,-30611744),n=ii(n,d,i,r,h[6],15,-1560198380),r=ii(r,n,d,i,h[13],21,1309151649),i=ii(i,r,n,d,h[4],6,-145523070),d=ii(d,i,r,n,h[11],10,-1120210379),n=ii(n,d,i,r,h[2],15,718787259),r=ii(r,n,d,i,h[9],21,-343485551),f[0]=add32(i,f[0]),f[1]=add32(r,f[1]),f[2]=add32(n,f[2]),f[3]=add32(d,f[3])}function cmn(f,h,i,r,n,d){return h=add32(add32(h,f),add32(r,d)),add32(h<<n|h>>>32-n,i)}function ff(f,h,i,r,n,d,g){return cmn(h&i|~h&r,f,h,n,d,g)}function gg(f,h,i,r,n,d,g){return cmn(h&r|i&~r,f,h,n,d,g)}function hh(f,h,i,r,n,d,g){return cmn(h^i^r,f,h,n,d,g)}function ii(f,h,i,r,n,d,g){return cmn(i^(h|~r),f,h,n,d,g)}function md51(f){txt="";var h,i=f.length,r=[1732584193,-271733879,-1732584194,271733878];for(h=64;h<=f.length;h+=64)md5cycle(r,md5blk(f.substring(h-64,h)));f=f.substring(h-64);var n=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];for(h=0;h<f.length;h++)n[h>>2]|=f.charCodeAt(h)<<(h%4<<3);if(n[h>>2]|=128<<(h%4<<3),h>55)for(md5cycle(r,n),h=0;16>h;h++)n[h]=0;return n[14]=8*i,md5cycle(r,n),r}function md5blk(f){var h,i=[];for(h=0;64>h;h+=4)i[h>>2]=f.charCodeAt(h)+(f.charCodeAt(h+1)<<8)+(f.charCodeAt(h+2)<<16)+(f.charCodeAt(h+3)<<24);return i}function rhex(f){for(var h="",i=0;4>i;i++)h+=hex_chr[f>>8*i+4&15]+hex_chr[f>>8*i&15];return h}function hex(f){for(var h=0;h<f.length;h++)f[h]=rhex(f[h]);return f.join("")}function add32(f,h){return f+h&4294967295}function add32(f,h){var i=(65535&f)+(65535&h),r=(f>>16)+(h>>16)+(i>>16);return r<<16|65535&i}var hex_chr="0123456789abcdef".split(""),md5=function(f){return hex(md51(f))};"5d41402abc4b2a76b9719d911017c592"!=md5("hello"),module.exports=md5;