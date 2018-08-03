"use strict";

var express = require('express'); //Express functionality
var router = express.Router(); //attaching a router variable to Express's router method
var mongo = require('mongodb'); //MongoDB
var objectId = require('mongodb').ObjectID;
var assert = require('assert'); //used to connect to database or for operations to check if everything is right

var url = 'mongodb://localhost:27017/uniplaner';

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


/* insert the form-data from the subject areas into mongodb */
/* see: https://www.youtube.com/watch?v=ZKwrOXl5TDI */
router.post('/insert', function(req, res, next) {
  console.log('bis hier tuts!');
  var item = { // form in subject.jade
    name: req.body.name,
    shortcut: req.body.shortcut,
    website: req.body.website,
    institutes: req.body.institutes
  };
  console.log(item);
  mongo.connect(url, function(err, db) { // connect to the database
  assert.equal(null, err); // check if there is an error
  db.db('data').collection('subject_areas').insertOne(item, function(err, result) { //name of the database-collection, one insert
    assert.equal(null, err); // check if there is an error
    console.log('Item inserted');
    db.close();
  });
});

res.redirect('subject'); // restart page
});

/* get the form-data from the subject areas from mongodb */
/* see: https://www.youtube.com/watch?v=ZKwrOXl5TDI */
router.get('/get-data', function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, db) { // connect to db
    assert.equal(null, err); // check error
    var cursor =  db.db('data').collection('subject_areas').find(); //cursor: pointing to the data which getting back
                                                        //find: get all entries in the collection and stored in cursor
    cursor.forEach(function(doc, err) { //for every found entry
      assert.equal(null, err); // check if error
      resultArray.push(doc); // push doc (every found item) in the array
    }, function() { //callback
      db.close(); //close db
      res.render('subject', {items: resultArray}); //must be here, because the function above is ansynchronous and must first finished
                                                  // page load again with the founded items (class in subject.jade)
    });
  });
});

module.exports = router;
