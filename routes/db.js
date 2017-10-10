var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  req.db.collection('max_todo').find().toArray(function(err, results) {
    if (err) {
      next(err);
    }

    res.render('db', {
      todos: results
    });
  });

});

module.exports = router;
