Quartz.lib = {};

Quartz.lib.fs = require('fs');

Quartz.lib.rd = require('rd');

Quartz.lib.url = require('url');

Quartz.lib.http = require('http');

Quartz.lib.path = require('path');

Quartz.lib._ = require('underscore')._;

Quartz.lib.express = require('express');

Quartz.lib.sanitizer = require('sanitizer');

Quartz.lib.validator = require('validator');

Quartz.lib.utility = {};

Quartz.lib.utility.md5 = require('./utility/md5');

Quartz.lib.utility.misc = require('./utility/misc');

Quartz.lib.utility.post = require('./utility/post');

Quartz.dao = {};

Quartz.dao.post = require('./dao/post');

Quartz.dao.comment = require('./dao/comment');

Quartz.dao.category = require('./dao/category');

Quartz.config = {};

Quartz.config.meta = require('./data/config/meta');

Quartz.config.system = require('./data/config/system');

Quartz.config.system.themesList = require('./dao/theme');

Quartz.api = {};

Quartz.api.post = require('./models/post');

Quartz.api.comment = require('./models/comment');

Quartz.api.archive = require('./models/archive');

Quartz.routes = require('./routes');
