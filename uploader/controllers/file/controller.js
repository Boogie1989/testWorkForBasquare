const { getFile, getAvailableFileNames } = require('../../helpers');
const { Readable } = require('stream');

class FileCtrl {
    async  upload(req, res) {
        try {
            const { query, app } = req;
            const readStream = new Readable();
            const fileUploderService = app.get('fileUploderService');
            const { stream, mime, id, ext } = await fileUploderService.addNewStreamAsync(query.fileName, query.startFrom, query.id);
            fileUploderService.setEvents(id, stream, res);
            res.writeHead(200, {
                'content-type': mime,
                'content-disposition': `attachment; filename=${query.fileName}`,
                'stream-id': id,
                'file-ext': ext
            });
            stream.on('data', (data) => {
                res.write(data);
            });
        } catch (e) {
            res.status(400).json({ error: e.message })
        }
    }
    pause(req, res) {
        try {
            const { query, app } = req;
            const fileUploderService = app.get('fileUploderService');
            const paused = fileUploderService.action(query.type, query.id);
            return res.json({ status: paused });
        } catch (e) {
            res.status(400).json({ error: e.message })
        }
    }
    async available(req, res) {
        try {
            const fileUploderService = req.app.get('fileUploderService');
            const files = await getAvailableFileNames(fileUploderService);
            return res.json(files);
        } catch (e) {
            return res.status(400).json({ error: e.message });
        }
    }
}

module.exports = new FileCtrl();