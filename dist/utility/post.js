exports.cutContent=function(n,t){var r,e;return null==t&&(t=!1),e=n,t===!0&&(r=e.indexOf("<!--more-->"),-1!==r&&(e=e.substring(0,r))),e};