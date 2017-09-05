const request = require('request-promise');
const config = require('config');

module.exports = async function () {
    try {
        const fileNames = await request(`${config.get('uploader.baseUrl')}/file/available`);
        return Promise.resolve(fileNames);
    } catch (e) {
        return Promise.reject(e);
    }
}