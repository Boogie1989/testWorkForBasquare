const { Router } = require('express');
const { index } = require('./controller');
const fileRouter = new Router();

fileRouter.get('/', index);

module.exports = fileRouter;