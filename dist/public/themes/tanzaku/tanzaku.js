(function() {
  angular.module('quartz.theme', ['quartz.config', 'ngRoute', 'infinite-scroll']).config([
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
                get: ['id', 'tags', 'title', 'content', 'postDate', 'category'],
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
                get: ['id', 'tags', 'title', 'content', 'postDate', 'category'],
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
          ],
          comments: [
            '$route', 'CommentLoader', function($route, CommentLoader) {
              return CommentLoader({
                id: $route.current.params.id,
                get: ['postDate', 'id', 'content', 'author', 'authorEmailMD5', 'commentDate'],
                offset: 0,
                limit: 15
              });
            }
          ]
        },
        templateUrl: '/public/themes/tanzaku/post.html'
      }).otherwise({
        redirectTo: '/'
      });
    }
  ]).service('redrawGrid', [
    '$rootScope', function($rootScope) {
      var COL_GAP_WIDTH, COL_WIDTH, MAX_COL_SIZE, arrWidth, lastPostCount, setGrid, x;
      lastPostCount = 0;

      /**
           重绘网格
       */
      setGrid = function() {
        return $("#grid-wrapper").vgrid({
          easeing: "easeOutQuint",
          time: 500,
          delay: 0,
          selRefGrid: "#grid-wrapper div.x1",
          selFitWidth: ["#container", "#footer"],
          gridDefWidth: 290 + 15 + 15 + 5,
          forceAnim: true
        });
      };
      MAX_COL_SIZE = 2;
      COL_WIDTH = 395;
      COL_GAP_WIDTH = 35;
      arrWidth = (function() {
        var _i, _results;
        _results = [];
        for (x = _i = 0; 0 <= MAX_COL_SIZE ? _i <= MAX_COL_SIZE : _i >= MAX_COL_SIZE; x = 0 <= MAX_COL_SIZE ? ++_i : --_i) {
          _results.push((COL_WIDTH * (x + 1)) + (COL_GAP_WIDTH * x));
        }
        return _results;
      })();
      return function(isRouteChange) {
        var anim_msec, colClass, height, i, img, isSinglePost, newHeight, newWidth, postDiv, postDivs, width, _i, _j, _len, _ref;
        if (isRouteChange == null) {
          isRouteChange = false;
        }
        isSinglePost = $rootScope.meta.isSinglePost;
        if (isSinglePost !== true && isRouteChange !== true && ((_ref = $rootScope.posts) != null ? _ref.length : void 0) === lastPostCount) {
          return null;
        }
        if (isSinglePost !== true) {
          postDivs = $('#grid-wrapper>div:not(:has(>.grid-image))');
          for (_i = 0, _len = postDivs.length; _i < _len; _i++) {
            postDiv = postDivs[_i];
            img = $(postDiv).find('img').first()[0];
            if (img != null) {
              width = img.clientWidth;
              height = img.clientHeight;
              for (i = _j = 0; 0 <= MAX_COL_SIZE ? _j <= MAX_COL_SIZE : _j >= MAX_COL_SIZE; i = 0 <= MAX_COL_SIZE ? ++_j : --_j) {
                if ((i >= MAX_COL_SIZE - 1) || (width < arrWidth[i + 1])) {
                  newWidth = arrWidth[i];
                  colClass = 'x' + (i + 1);
                  break;
                }
              }
              newHeight = parseInt(newWidth * (height / width), 10);
              $('#' + $(postDiv).attr('id') + '>.post-title').after("<div class=\"grid-image\"><a href=\"" + $('#' + $(postDiv).attr('id') + '>.post-title>a').attr('href') + ("\" title=\"" + ($('#' + $(postDiv).attr('id') + '>.post-title').text()) + "\"><img src=\"" + ($(img).attr('src')) + "\"></a>"));
              $(img).remove();
            }
          }
        }
        if (isSinglePost) {
          $('#grid-wrapper').css('display', 'none');
        }
        $("#grid-wrapper").css("paddingTop", "0px");
        setTimeout(setGrid, 10);
        if (isSinglePost) {
          anim_msec = $("#single-wrapper").height();
          if (anim_msec < 1000) {
            anim_msec = 1000;
          }
          if (anim_msec > 3000) {
            anim_msec = 3000;
          }
          $("#single-wrapper").css("paddingTop", "0px").hide().slideDown(anim_msec);
        }
        if ($('#header').css('visibility') === 'hidden') {
          $("#header").hide().css("visibility", "visible").fadeIn(500);
        }
        setTimeout(function() {
          return $rootScope.LoadMoreLock = false;
        }, 1500);
        if (isSinglePost !== true) {
          return lastPostCount = $rootScope.posts.length;
        }
      };
    }
  ]).controller('MultiPostCtrl', [
    '$rootScope', 'Post', 'MultiPostLoader', 'redrawGrid', 'type', function($rootScope, Post, MultiPostLoader, redrawGrid, type) {
      setTimeout(function() {
        return redrawGrid(true);
      }, 50);
      return $rootScope.LoadMore = function() {
        if ($rootScope.LoadMoreLock !== true) {
          $rootScope.LoadMoreLock = true;
          MultiPostLoader({
            type: type,
            offset: $rootScope.lastPostOrd,
            limit: $rootScope.meta.maxPostsPerReq,
            get: ['id', 'tags', 'title', 'content', 'postDate'],
            moreTag: true
          }).then(redrawGrid);
        }
        if ($rootScope.allPostsLoaded) {
          return $rootScope.LoadMore = function() {};
        }
      };
    }
  ]).controller('PostCtrl', [
    'redrawGrid', function(redrawGrid) {
      return redrawGrid(true);
    }
  ]);

}).call(this);
