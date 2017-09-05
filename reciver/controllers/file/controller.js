const path = require('path');

class FileCtrl {
    index(req, res) {
        res.sendFile(path.resolve(req.app.get('pathToViews'), './index.html'));
    }
}

module.exports = new FileCtrl();