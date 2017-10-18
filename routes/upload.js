var express = require('express');
var router = express.Router();

// add co lib to chain promises
var co = require('co');

var mongodb = require('mongodb');

// add multer lib to support file uploads
var multer  = require('multer')
var multerGridFs = require('multer-gridfs-storage');

// use this for sending files to browser from gridfs
var Gridfs = require('gridfs-stream');

// to store in memory:
// var upload = multer({ storage: multer.memoryStorage() })

// to store in mongodb (GridFS):
const multerGridFsStorage = multerGridFs({
   url: process.env.DB_URI
});
var upload = multer({ storage: multerGridFsStorage });

// to store on the filesystem; also add this dir to .gitignore!
// var upload = multer({ dest: 'uploads/' })

router.get('/', function(req, res, next) {

  // example of using co + promises to simplify sequential mongo queries
  co(function*() {
    var col = req.db.collection('fs.files');

    var count = yield col.find().count();
    var files = yield col.find().toArray();

    res.render('upload', {
      scripts: ['file-upload.js'],
      numFiles: count,
      files: files,
    });

  }).catch(function(err) {
    next(err);
  });

});

router.get('/view/:fileId', function(req, res, next) {
  var gfs = Gridfs(req.db, mongodb);
  var readstream = gfs.createReadStream({
    _id: req.params.fileId
  });
  return readstream.pipe(res);
});

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
