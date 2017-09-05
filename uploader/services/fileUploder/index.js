const { getFile, getAvailableFileNames } = require('../../helpers');
const shortid = require('shortid');

class FileUploderService {

    constructor() {
        this.streams = {};
    }

    addNewStreamAsync(fileName, startFrom, id) {
        return new Promise(async (resolve, reject) => {
            try {
                const { stream, mime, ext } = await getFile(fileName, startFrom);
                id = id ? id : this.createId();
                if (this.streams[id]) {
                    throw new Error(`id ${id} exist now.`);
                }
                this.streams[id] = { stream, mime, id, ext };
                return resolve(this.streams[id]);
            } catch (error) {
                return reject(error);
            }
        });
    }

    action(type, id) {
        const currentStream = this.streams[id];
        if (currentStream && currentStream.stream) {
            if (currentStream.stream[type]) {
                currentStream.stream[type]();
            } else {
                throw new Error('Action is wrong. Only "pause" or "resume" suports');
            }
            return 'ok';
        } else {
            throw new Error('id is wrong.');
        }
    }

    setEvents(id, stream, res) {
        ['close', 'end', 'error'].forEach(e => {
            stream.on(e, () => { this.removeStream(id, res) });
            res.on(e, () => { this.removeStream(id) });
        });
    }

    removeStream(id, res) {

        if (res) {
            res.end();
        } else {
            if (this.streams[id] && this.streams[id].stream)
                this.streams[id].stream.destroy();
        }
        delete this.streams[id];
    }

    createId() {
        let id = shortid.generate();
        if (this.streams[id]) {
            id += Date.now();
        }
        return id;
    }

}

module.exports = FileUploderService;