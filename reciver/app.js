const express = require('express');
const config = require('config');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const hbs = require('hbs');
const app = express();
const port = config.get('server.port');
const initControllers = require('./controllers');

const { uploadFileAsync, resumeDownload, getAvailableFileNames } = require('./helpers');

// uploadFileAsync('music.7z', 1235).catch(e => console.log(e))
resumeDownload();

// getAvailableFileNames().then(names => console.log(names)).catch(names => console.log(names))
app.use(express.static('./static'));
app.set('pathToViews', path.resolve(__dirname, './views'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());

initControllers(app);

app.listen(port, console.log(`Server start on port ${port}`));
