const { readdir } = require('fs-promise');
const path = require('path');
const config = require('config');

module.exports = async function (fileUploderService) {
    try {
        const files = [];
        const folders = await readdir(path.resolve(__dirname, '../../output'));
        for (let i = 0; i < folders.length; i++) {
            const folder = folders[i];
            const filesInFolder = await readdir(path.resolve(__dirname, `../../output/${folder}`));
            files.push(...filesInFolder);
        }
        return files.map(f => {
            return {
                name: f,
                url: `${config.get('baseUrl')}${config.get('server.port')}/file/download?fileName=${f}&id=${fileUploderService.createId()}`
            }
        });
    } catch (e) {
        return Promise.reject(e);
    }
}