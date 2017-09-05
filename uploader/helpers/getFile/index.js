const { stat, readdir, mkdir } = require('fs-promise');
const { createReadStream } = require('fs');
const path = require('path');
const mime = require('mime-types')
const pathToOutput = path.resolve(__dirname, `../../output`);
createOutputFolder(pathToOutput);

module.exports = function getFile(fileName = '', startFrom) {
    return new Promise(async (resolve, reject) => {
        try {
            let folderName = fileName.split('.');
            folderName = folderName.slice(0, folderName.length - 1).join('');
            const folders = await readdir(pathToOutput);
            const folderExist = await checkIfFolderExists(folders, folderName);
            if (folderExist) {
                const pathToFile = path.resolve(pathToOutput, `./${folderName}/${fileName}`);
                const statistic = await stat(pathToFile);
                const streamOpt = {};
                if (startFrom) {
                    streamOpt.start = Number(startFrom);
                }
                return resolve({
                    stream: createReadStream(pathToFile, streamOpt),
                    ext: path.extname(pathToFile),
                    mime: mime.lookup(pathToFile)
                });
            } else {
                throw new Error('file not exist');
            }
        }
        catch (e) {
            return reject(e);
        }
    });
}
function checkIfFolderExists(folders, folder) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < folders.length; i++) {
            if (folders[i].toLowerCase() === folder.toLowerCase()) {
                return resolve(true);
            }
        }
        return resolve(false);
    });
}

async function createOutputFolder(path) {
    try {
        await stat(path);
    } catch (e) {
        await mkdir(path);
    }
}