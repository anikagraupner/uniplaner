"use strict";

var express = require('express'); //Express functionality
var router = express.Router(); //attaching a router variable to Express's router method

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Startpage' });
});

/* GET legal notice. */
router.get('/imprint', function(req, res) {
  res.render('imprint', { title: 'Legal notice' });
});

/* GET map1. */
router.get('/map1', function(req, res) {
  res.render('map1', { title: 'map1' });
});

module.exports = router;
