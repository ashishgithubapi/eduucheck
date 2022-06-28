const router = require('express').Router();


const {fileUpload} = require('../Controllers/fileUploadController')

router.route('/fileupload')
.post(fileUpload)

module.exports = router