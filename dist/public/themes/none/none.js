(function() {
  angular.module('quartz.theme', ['quartz.config', 'ngRoute', 'ngAnimate', 'infinite-scroll']).config([
    '$routeProvider', 'routeUrls', function($routeProvider, routeUrls) {
      return $routeProvider.when(routeUrls.HomePage, {
        controller: 'MultiPostCtrl',
        resolve: {
          posts: [
            'MultiPostLoader', '$rootScope', function(MultiPostLoader, $rootScope) {
              return MultiPostLoader({
                type: 'Post',
                offset: 0,
                limit: $rootScope.meta.maxPostsPerReq,
                get: ['id', 'tags', 'title', 'content', 'postDate'],
                moreTag: true
              });
            }
          ],
          type: function() {
            return 'Post';
          }
        },
        templateUrl: 'multipost.html'
      }).when(routeUrls.Category, {
        controller: 'MultiPostCtrl',
        resolve: {
          posts: [
            'MultiPostLoader', '$rootScope', function(MultiPostLoader, $rootScope) {
              return MultiPostLoader({
                type: 'Category',
                offset: 0,
                limit: $rootScope.meta.maxPostsPerReq,
                get: ['id', 'tags', 'title', 'content', 'postDate'],
                moreTag: true
              });
            }
          ],
          type: function() {
            return 'Category';
          }
        },
        templateUrl: 'multipost.html'
      }).when(routeUrls.Tag, {
        controller: 'MultiPostCtrl',
        resolve: {
          posts: [
            'MultiPostLoader', '$rootScope', function(MultiPostLoader, $rootScope) {
              return MultiPostLoader({
                type: 'Tag',
                offset: 0,
                limit: $rootScope.meta.maxPostsPerReq,
                get: ['id', 'tags', 'title', 'content', 'postDate'],
                moreTag: true
              });
            }
          ],
          type: function() {
            return 'Tag';
          }
        },
        templateUrl: 'multipost.html'
      }).when(routeUrls.Single, {
        controller: 'PostCtrl',
        resolve: {
          post: [
            'PostLoader', function(PostLoader) {
              return PostLoader();
            }
          ]
        },
        templateUrl: '/public/themes/none/post.html'
      }).when(routeUrls.Archive, {
        controller: 'ArchiveCtrl',
        resolve: {
          archive: [
            'ArchiveLoader', function(ArchiveLoader) {
              return ArchiveLoader(['id', 'title', 'postDate'], true);
            }
          ]
        },
        templateUrl: '/public/themes/none/archive.html'
      }).when(routeUrls['404'], {
        resolve: {
          t: [
            'NotFoundLoader', function(NotFoundLoader) {
              return NotFoundLoader();
            }
          ]
        },
        controller: 'NotFoundCtrl',
        templateUrl: '/public/themes/none/404.html'
      }).otherwise({
        redirectTo: '/404'
      });
    }
  ]).controller('MultiPostCtrl', [
    '$rootScope', 'Post', 'MultiPostLoader', 'type', function($rootScope, Post, MultiPostLoader, type) {
      return $rootScope.LoadMore = function() {
        MultiPostLoader({
          type: type,
          offset: $rootScope.lastPostOrd,
          limit: $rootScope.meta.maxPostsPerReq,
          get: ['id', 'tags', 'title', 'content', 'postDate'],
          moreTag: true
        });
        if ($rootScope.allPostsLoaded) {
          return $rootScope.LoadMore = function() {};
        }
      };
    }
  ]).controller('PostCtrl', [
    function() {
      return $('header>img').fadeOut(1000);
    }
  ]).controller('NotFoundCtrl', [function() {}]).controller('ArchiveCtrl', [
    '$rootScope', 'archive', '$scope', function($rootScope, archive, $scope) {
      var key, months, post, val, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
      $rootScope.categories = archive;
      $scope.tposts = [];
      for (key in archive) {
        if (key[0] !== '$') {
          _ref = archive[key].posts;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            post = _ref[_i];
            $scope.tposts.push(post);
          }
        }
      }
      $scope.tposts.sort(function(a, b) {
        return b.postDate - a.postDate;
      });
      _ref1 = $scope.tposts;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        val = _ref1[_j];
        val.postDate = new Date(val.postDate);
      }
      months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
      _ref2 = $scope.tposts;
      for (key = _k = 0, _len2 = _ref2.length; _k < _len2; key = ++_k) {
        val = _ref2[key];
        if (key === 0 || val.postDate.getFullYear() !== $scope.tposts[key - 1].postDate.getFullYear()) {
          $scope.tposts[key].year = val.postDate.getFullYear();
        }
        if (key === 0 || months[val.postDate.getMonth()] !== months[$scope.tposts[key - 1].postDate.getMonth()]) {
          $scope.tposts[key].month = months[val.postDate.getMonth()];
        }
      }
      return $scope.curMonth = 0;
    }
  ]).directive('noneTitleInit', function() {
    return {
      restrict: 'A',
      link: function() {
        var height, resize, width;
        height = $(window).height();
        width = $(window).width();
        resize = function() {
          height = $(window).height();
          width = $(window).width();
          $(".site-head .title").css("margin-top", height / 2 - 253);
          return $(".site-head").css("height", height);
        };
        resize();
        window.onresize = resize;
        $('#down').click(function() {
          return $(document.body).animate({
            scrollTop: height
          }, 1000);
        });
        $('#top-bg').css('opacity', 0);
        return window.onscroll = function() {
          var blur;
          blur = $("body").scrollTop() / height;
          return $("#top-bg").css("opacity", blur);
        };
      }
    };
  }).animation('.top-bg', function() {
    return {
      enter: function(element, done) {
        $(element).hide().fadeIn(1000, done);
        return function(isCancelled) {
          if (isCancelled) {
            return $(element).stop();
          }
        };
      },
      leave: function(element, done) {
        $("html, body").animate({
          scrollTop: "0px"
        }, 0);
        $(element).fadeOut(1000, done);
        return function(isCancelled) {
          if (isCancelled) {
            return $(element).stop();
          }
        };
      }
    };
  });

}).call(this);
