var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.db.collection('max_todo').find().toArray(function(err, results) {
    if (err) {
      next(err);
    }

    res.render('index', {
      title: 'Express Demos',
      scripts: ['file-upload.js'],
      todos: results
    });
  });

});

module.exports = router;
