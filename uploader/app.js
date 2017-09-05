const express = require('express');
const config = require('config');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = config.get('server.port');
const initControllers = require('./controllers');
const { fileUploderService } = require('./services');

app.set('fileUploderService', new fileUploderService());

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());

initControllers(app);

app.listen(port, console.log(`Server start on port ${port}`));
