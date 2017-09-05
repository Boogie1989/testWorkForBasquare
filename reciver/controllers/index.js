const { renderRouter } = require('./render');

module.exports = function initControllers(app) {
    app.use('/', renderRouter);
}