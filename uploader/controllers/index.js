const { fileRouter } = require('./file');

module.exports = function initControllers(app) {
    app.use('/file', fileRouter);
}