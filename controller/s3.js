let express = require('express');
let router = express.Router();
 
let upload = require('../config/multer.config.js');

const awsWorker = require('./s3.controller.js');
 
router.post('/files/upload', upload.single("file"), awsWorker.doUpload);

router.get('/files/all', awsWorker.listKeyNames);

router.get('/files/:filename', awsWorker.doDownload);
 
module.exports = router;