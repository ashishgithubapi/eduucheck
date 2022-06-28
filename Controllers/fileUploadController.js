const Jimp = require("jimp"); const fs = require("fs");

module.exports.fileUpload = function (req, res) {
    console.log('ashish');

      var data = req.body.data; // Convert base64 to buffer => <Buffer ff d8 ff db 00 43 00 ... 
      
      const buffer = Buffer.from(data, "base64"); 
      Jimp.read(buffer, (err, res) => { if (err) throw new Error(err); res.quality(100).write(req.body.file_name); });

      res.send('this is the file upload')
}