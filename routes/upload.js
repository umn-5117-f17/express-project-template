var express = require('express');
var router = express.Router();

// add multer lib to support file uploads
var multer  = require('multer')
var upload = multer({ storage: multer.memoryStorage() })
// to store on the filesystem; also add this dir to .gitignore!
// var upload = multer({ dest: 'uploads/' })

router.post('/upload-file-form', upload.single('thefile'), function(req, res) {
  if (!req.file) {
    res.status(500).send('error: no file');
  }

  /*
  req.file:
    upload-file-form { fieldname: 'thefile',
    originalname: 'upload-me.txt',
    encoding: '7bit',
    mimetype: 'text/plain',
    destination: 'uploads/',
    filename: '4e5b95869729cf62b4db9005fe9ce575',
    path: 'uploads/4e5b95869729cf62b4db9005fe9ce575',
    size: 30 }
  */

  res.json({
    'filename': req.file.originalname,
    'mimetype': req.file.mimetype,
    'size (bytes)': req.file.size
  });
})

router.post('/upload-file-ajax', upload.single('ajaxfile'), function(req, res) {
  if (!req.file) {
    res.status(500).send('error: no file');
  }

  // actually do something with file...
  if (req.file.mimetype == 'text/plain') {
    var text = req.file.buffer.toString('utf8');
    console.log('contents of file:', text);
  } else {
    console.log('got a non-text file. here are some bytes:');
    console.log(req.file.buffer);
  }

  res.json({
    'filename': req.file.originalname,
    'mimetype': req.file.mimetype,
    'size (bytes)': req.file.size
  });
})

module.exports = router;
