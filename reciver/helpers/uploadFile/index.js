const { stat, rename, unlink, writeFile } = require('fs-promise');
const { createWriteStream, createReadStream } = require('fs');
const CombinedStream = require('combined-stream');
const request = require('request-promise');
const config = require('config');
const path = require('path');
let filesUploadStat = require('./stat.json');
const pathToUploadFolder = path.resolve(__dirname, `../../upload`);
const filesUploadStatPath = path.resolve(__dirname, './stat.json');

module.exports = async function uploadFileAsync(fileName, startFrom) {
    try {
        const file = filesUploadStat.find(f => f === fileName);
        if (!file) {
            filesUploadStat.push(fileName);
        }
        await writeFile(filesUploadStatPath, JSON.stringify(filesUploadStat));
        const res = await upload(fileName, startFrom);
        const index = filesUploadStat.findIndex(f => f === fileName);
        filesUploadStat.splice(index, 1);
        await writeFile(filesUploadStatPath, JSON.stringify(filesUploadStat));
        return res;
    } catch (e) { return Promise.reject(e) }
}

function upload(fileName, startFrom) {
    let url = `${config.get('uploader.baseUrl')}/file/download?fileName=${fileName}`;
    if (startFrom) {
        url = `${url}&startFrom=${startFrom}`;
        return uploadFrom(url, fileName);
    } else {
        return uploadFullFile(url, fileName);
    }
}

function uploadFullFile(url, fileName) {
    const writeStream = createWriteStream(path.resolve(pathToUploadFolder, `./${fileName}`));
    request.get(url).pipe(writeStream);
    return new Promise((resolve, reject) => {
        writeStream.on('end', () => {
            return resolve(true)
        });
        writeStream.on('close', () => {
            return resolve(true)
        });
        writeStream.on('error', (error) => {
            return reject(error)
        });
    });
}

function uploadFrom(url, fileName) {
    return new Promise(async (resolve, reject) => {
        try {
            const filePath = path.resolve(pathToUploadFolder, `./${fileName}`);
            const newFilePath = path.resolve(pathToUploadFolder, `./${Date.now()}-${fileName}`);
            const renamed = await rename(filePath, newFilePath);
            const fileStat = await stat(newFilePath);
            const combinedStream = CombinedStream.create();
            const writeStream = createWriteStream(filePath);
            combinedStream.append(createReadStream(newFilePath));
            combinedStream.append(request.get(url));
            combinedStream.pipe(writeStream);
            const unlinkFileCallback = getUnlinkFileCallback(newFilePath, resolve, reject);
            ['finish', 'close'].forEach(e => {
                writeStream.on(e, unlinkFileCallback);
            })
        } catch (e) {
            console.log(e);
            return reject(e)
        }
    });

    function getUnlinkFileCallback(newFilePath, resolve, reject) {
        let count = 0;
        return async function () {
            try {
                if (count === 0) {
                    count++;
                    await unlink(newFilePath);
                }
                return resolve(true);
            } catch (e) {
                console.log(e);
                return reject(e)
            }
        }
    }
}