var express = require('express');
var router = express.Router();
// Use body-parser to retrieve the raw body as a buffer
const bodyParser = require('body-parser');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Express',
  });
});

module.exports = router;
