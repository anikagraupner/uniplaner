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
  db.db('uniplaner').collection('subject_areas').insertOne(item, function(err, result) { //name of the database-collection, one insert
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
  mongo.connect(url, function(err, db) { // connect to db
    assert.equal(null, err); // check error
    var cursor =  db.db('uniplaner').collection('subject_areas').find(); //cursor: pointing to the data which getting back
                                                        //find: get all entries in the collection and stored in cursor
      }, function() { //callback
      db.close(); //close db
      res.render('subject', {items: cursor}); //must be here, because the function above is ansynchronous and must first finished
                                                  // page load again with the founded items (class in subject.jade)
  });
});

router.post('/update', function(req, res, next) {
  var item = {
    name: req.body.name,
    shortcut: req.body.shortcut,
    website: req.body.website,
    institutes: req.body.institutes
  };
  var id = req.body.id;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.db('uniplaner').collection('subject_areas').updateOne({"_id": objectId(id)}, {$set: item}, function(err, result) {
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });
  });
});

router.post('/delete', function(req, res, next) {
  var id = req.body.id;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.db('uniplaner').collection('subject_areas').deleteOne({"_id": objectId(id)}, function(err, result) {
      assert.equal(null, err);
      console.log('Item deleted');
      db.close();
    });
  });
});

module.exports = router;
