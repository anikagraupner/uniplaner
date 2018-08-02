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

/* GET institute. */
router.get('/institute', function(req, res) {
  res.render('institute', { title: 'Add an institute' });
});

/* GET subject. */
router.get('/subject', function(req, res) {
  res.render('subject', { title: 'Add the subject areas!' });
});

module.exports = router;
