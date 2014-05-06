quartz = angular.module('quartz', ['quartz.services', 'quartz.config', 'quartz.theme', 'ngSanitize'])

quartzService = angular.module 'quartz.services', ['ngResource', 'ngRoute']

quartzConfig = angular.module 'quartz.config', []