module.exports = {
  adminEmail: "xylon.tao@gmail.com",
  blogName: "nook",
  blogLang: "zh-cn",
  blogDescription: "及时行乐",
  homePage: "http://localhost:3000/",
  siteUrl: "http://localhost:3000/",
  minCommentLength: 10,
  maxCommentLength: 1500,
  maxPostPerReq: 15,
  routeUrls: {
    HomePage: '/',
    "404": '/404',
    Archive: '/archive',
    Category: '/category/:category',
    Single: '/:id/:title',
    Tag: '/tag/:tag',
    aboutMe: "/about"
  }
};
