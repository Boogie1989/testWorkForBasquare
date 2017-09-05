const { Router } = require('express');
const { upload, pause, available } = require('./controller');
const fileRouter = new Router();

fileRouter.get('/download', upload);
fileRouter.get('/pause', pause);
fileRouter.get('/available', available);

module.exports = fileRouter;