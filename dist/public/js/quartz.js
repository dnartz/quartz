(function() {
  var quartz, quartzConfig, quartzService;

  quartz = angular.module('quartz', ['quartz.services', 'quartz.config', 'quartz.theme', 'ngSanitize']);

  quartzService = angular.module('quartz.services', ['ngResource', 'ngRoute']);

  quartzConfig = angular.module('quartz.config', []);

  quartzConfig.constant('routeUrls', {
    HomePage: '/',
    "404": '/404',
    Archive: '/archive',
    Category: '/category/:category',
    Single: '/:id/:title',
    Tag: '/tag/:tag'
  }).constant('maxPostsPerReq', 15);

  quartz.config([
    '$locationProvider', function($locationProvider) {
      return $locationProvider.html5Mode(true);
    }
  ]);

  quartz.run([
    '$rootScope', '$route', '$http', 'routeUrls', function($rootScope, $route, $http, routeUrls) {
      $http.get('/api/meta').success(function(data) {
        if (_.isObject($rootScope.meta) !== true) {
          $rootScope.meta = {};
        }
        return $rootScope.meta = _.extend($rootScope.meta, data);
      });
      return $rootScope.$on('$routeChangeSuccess', function(e, currentRoute) {
        currentRoute = currentRoute.$$route.originalPath;
        $rootScope.meta.isHomePage = currentRoute === routeUrls.HomePage;
        $rootScope.meta.isSinglePost = currentRoute === routeUrls.Single;
        $rootScope.meta.is404 = currentRoute === routeUrls['404'];
        $rootScope.meta.isArchive = currentRoute === routeUrls.Archive;
        $rootScope.meta.isCategory = currentRoute === routeUrls.Category;
        return $rootScope.meta.isTagPage = currentRoute === routeUrls.Tag;
      });
    }
  ]);

  quartzService.directive("httpPrefix", function() {
    return {
      restrict: "A",
      scope: false,
      require: "ngModel",
      link: function(scope, element, attr, ngModel) {
        return element.bind("change", function() {
          if (!/^(http):\/\//i.test(ngModel.$viewValue) && ngModel.$viewValue) {
            ngModel.$setViewValue("http://" + ngModel.$viewValue);
            return ngModel.$render();
          }
        });
      }
    };
  });

  quartzService.factory('Archive', [
    '$resource', function($resource) {
      return $resource('/api/archive', {});
    }
  ]);

  quartzService.factory('Category', [
    '$resource', function($resource) {
      return $resource('/api/category/:category', {
        category: '@category'
      });
    }
  ]);

  quartzService.factory('Comment', [
    '$resource', function($resource) {
      return $resource('/api/comment/p/:id', {
        id: '@id'
      }, {
        save: {
          method: 'POST',
          isArray: false,
          responseType: 'json',
          url: '/api/comment'
        }
      });
    }
  ]);

  quartzService.factory('Post', [
    '$resource', function($resource) {
      return $resource('/api/p/:id', {
        id: '@id'
      });
    }
  ]);

  quartzService.factory('Tag', [
    '$resource', function($resource) {
      return $resource('/api/tag/:tag', {
        tag: '@tag'
      });
    }
  ]);

  quartzService.factory('AddComment', [
    'Comment', '$q', '$rootScope', function(Comment, $q, $rootScope) {
      return function(args) {
        var delay;
        delay = $q.defer();
        return Comment.save({
          postId: args.postId,
          content: args.content,
          author: args.author,
          authorEmail: args.authorEmail,
          authorHomePage: args.authorHomePage
        }, function(res) {
          $rootScope.ResetCommentForm();
          if (!_.isArray($rootScope.post.comments)) {
            $rootScope.post.comments = [];
          }
          $rootScope.post.comments.unshift(res.comment);
          $rootScope.post.commentCount++;
          $rootScope.commentSubmitStatus = res;
          return delay.resolve(res);
        }, function(err) {
          $rootScope.commentSubmitStatus = err.data;
          return delay.reject(err.data);
        });
      };
    }
  ]);

  quartzService.factory('ArchiveLoader', [
    '$rootScope', 'Archive', '$q', 'titleFn', function($rootScope, Archive, $q, titleFn) {
      return function(properties, moreTag) {
        var delay;
        if (moreTag == null) {
          moreTag = false;
        }
        delay = $q.defer();
        Archive.get({
          get: properties,
          moreTag: moreTag
        }, function(archive) {
          titleFn('Archive');
          return delay.resolve(archive);
        }, function() {
          return delay.reject('Unable to fetch archive');
        });
        return delay.promise;
      };
    }
  ]);

  quartzService.factory('CommentLoader', [
    '$rootScope', '$q', 'Comment', function($rootScope, $q, Comment) {
      return function(args) {
        var delay;
        delay = $q.defer();
        return Comment.query({
          id: args.id,
          offset: args.offset,
          limit: args.limit,
          get: args.get
        }, function(comments) {
          $rootScope.post.comments = comments;
          return delay.resolve(comments);
        }, function() {
          return delay.reject('Unable to fetch comments');
        });
      };
    }
  ]);

  quartzService.factory('MultiPostLoader', [
    'Post', 'Category', 'Tag', '$rootScope', '$q', '$route', 'titleFn', function(Post, Category, Tag, $rootScope, $q, $route, titleFn) {
      var prevCategory, prevTag, prevType;
      prevType = '';
      prevTag = '';
      prevCategory = '';
      return function(args) {
        var delay, ttyp, typ;
        delay = $q.defer();
        typ = {
          Post: Post,
          Category: Category,
          Tag: Tag
        }[args.type];
        if ($route.current.$$route.originalPath === '/') {
          ttyp = 'HomePage';
        } else {
          ttyp = args.type;
        }
        if (prevType !== args.type || prevTag !== $route.current.params.tag || prevCategory !== $route.current.params.category) {
          prevType = args.type;
          prevTag = $route.current.params.tag;
          prevCategory = $route.current.params.category;
          $rootScope.posts = [];
        } else {
          if ($rootScope.posts.length > args.offset) {
            delay.resolve($rootScope.posts);
            return delay.promise;
          }
        }
        delete args.type;
        if (typ === Category) {
          args.category = $route.current.params.category;
        }
        if (typ === Tag) {
          args.tag = $route.current.params.tag;
        }
        typ.query(args, function(posts) {
          if (_.isUndefined(ttyp)) {
            ttyp = 'HomePage';
          }
          titleFn(ttyp);
          if ($rootScope.posts.length === 0) {
            $rootScope.posts = posts;
          } else {
            $rootScope.posts = $rootScope.posts.concat(posts);
          }
          if (posts.length === 0) {
            $rootScope.allPostsLoaded = true;
          }
          $rootScope.lastPostOrd = $rootScope.posts.length;
          return delay.resolve(posts);
        }, function() {
          return delay.reject('获取文章失败。');
        });
        return delay.promise;
      };
    }
  ]);

  quartzService.factory('NotFoundLoader', [
    '$rootScope', '$interval', '$q', 'titleFn', function($rootScope, $interval, $q, titleFn) {
      return function() {
        var delay, interv;
        delay = $q.defer();
        interv = $interval(function() {
          if (_.isObject($rootScope.meta) && $rootScope.meta.hasOwnProperty('blogName')) {
            titleFn('404');
            delay.resolve(404);
            return $interval.cancel(interv);
          }
        }, 10);
        return delay.promise;
      };
    }
  ]);

  quartzService.factory('PostLoader', [
    'Post', '$q', '$route', '$rootScope', 'titleFn', function(Post, $q, $route, $rootScope, titleFn) {
      return function(get) {
        var delay;
        delay = $q.defer();
        Post.get({
          id: $route.current.params.id
        }, function(post) {
          if (post.title !== $route.current.params.title) {
            window.location = '/404';
          }
          $rootScope.post = post;
          titleFn('Post');
          return delay.resolve(post);
        }, function() {
          return delay.reject("Unable to fetch post " + $route.current.params.id);
        });
        return delay.promise;
      };
    }
  ]);

  quartzService.service('titleFn', [
    '$rootScope', '$route', function($rootScope, $route) {
      return function(type) {
        return $rootScope.meta.title = {
          Post: function() {
            return $rootScope.post.title + ' | ' + $rootScope.meta.blogName;
          },
          HomePage: function() {
            return $rootScope.meta.blogName + ' | ' + $rootScope.meta.blogDescription;
          },
          Category: function() {
            return '» ' + $route.current.params.category + ' | ' + $rootScope.meta.blogName;
          },
          Tag: function() {
            return '» ' + $route.current.params.tag + ' | ' + $rootScope.meta.blogName;
          },
          Archive: function() {
            return "» 所有文章 | " + $rootScope.meta.blogName;
          },
          "404": function() {
            return "404 | " + $rootScope.meta.blogName;
          }
        }[type]();
      };
    }
  ]);

}).call(this);
