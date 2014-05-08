# 通用类库库
Quartz.lib = {}
Quartz.lib.fs = require 'fs'
Quartz.lib.rd = require 'rd'
Quartz.lib.url = require 'url'
Quartz.lib.http = require 'http'
Quartz.lib.path = require 'path'
Quartz.lib._ = require('underscore')._
Quartz.lib.express = require 'express'
Quartz.lib.sanitizer = require 'sanitizer'
Quartz.lib.validator = require 'validator'

# Quartz自身的通用类库
Quartz.lib.utility = {}
Quartz.lib.utility.md5 = require './utility/md5'
Quartz.lib.utility.misc = require './utility/misc'
Quartz.lib.utility.post = require './utility/post'

# 数据库连接模型
Quartz.dao = {}
Quartz.dao.post = require './dao/post'
Quartz.dao.comment = require './dao/comment'
Quartz.dao.category = require './dao/category'

# 平台配置
Quartz.config = {}
Quartz.config.meta = require './data/config/meta'
Quartz.config.system = require './data/config/system'
Quartz.config.system.themesList = require './dao/theme'

# API
Quartz.api = {}
Quartz.api.post = require './models/post'
Quartz.api.comment = require './models/comment'
Quartz.api.archive = require './models/archive'

# 路由
Quartz.routes = require './routes'
