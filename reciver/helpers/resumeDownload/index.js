const filesUploadStat = require('../uploadFile/stat.json');
const uploadFile = require('../uploadFile');
const { stat } = require('fs-promise');
const path = require('path');

module.exports = function resumeDownload() {
    filesUploadStat.forEach(async file => {
        const s = await stat(path.resolve(__dirname, `../../upload/${file}`));
        uploadFile(file, s.size);
    });
}