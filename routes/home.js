var express = require('express');
var router = express.Router();
// Use body-parser to retrieve the raw body as a buffer
const bodyParser = require('body-parser');
require("dotenv").config();

/* GET home page. */
router.get('/', function(req, res, next) {

  console.log(process.env.STRIPE_PUBLISHABLE_KEY);
  res.render('home', { 
    title: 'Merchant App',
    stripePK: process.env.STRIPE_PUBLISHABLE_KEY
  });
});

module.exports = router;
