const { Router } = require('express');
const { index } = require('./controller');
const renderRouter = new Router();

renderRouter.get('/', index);

module.exports = renderRouter;