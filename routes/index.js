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
router.get('/faculty', function(req, res) {
  res.render('faculty', { title: 'Add a faculty!' });
});

/* saved_subject_areas. */
router.get('/saved_faculties', function(req, res) {
  res.render('saved_faculties', { title: 'Saved faculties!' });
});

/* get the form-data from the subject areas from mongodb */
/* see: https://github.com/mschwarzmueller/nodejs-basics-tutorial */
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
  db.db('uniplaner').collection('faculties').insertOne(item, function(err, result) { //name of the database-collection, one insert
    assert.equal(null, err); // check if there is an error
    console.log('Item inserted');
    db.close();
  });
});

res.redirect('faculty'); // restart page
});

/* GET geolist page. */
// extracting db object which is passed to the http request
// using that db connection to fill the docs variable with database documents
// page render
router.get('/get-data', function(req, res) {
    var db = req.db;
    var collection = db.get('faculties');// tells the app which collection should be used
    collection.find({},{},function(e,docs){// do a find
        console.log(docs);
        res.render('saved_faculties', {// render of saved_faculties.jade
            "faculty" : docs// passing the database documents to the variable faculty
        });
    });

});

/* get the form-data from the subject areas from mongodb */
/* see: https://github.com/mschwarzmueller/nodejs-basics-tutorial */
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
    db.db('uniplaner').collection('faculties').updateOne({"_id": objectId(id)}, {$set: item}, function(err, result) {
      assert.equal(null, err);
      console.log('Item updated');
      db.close();
    });
  });

  res.redirect('faculty'); // restart page

});

/* get the form-data from the subject areas from mongodb */
/* see: https://github.com/mschwarzmueller/nodejs-basics-tutorial */
router.post('/delete', function(req, res, next) {
  var id = req.body.id;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.db('uniplaner').collection('faculties').deleteOne({"_id": objectId(id)}, function(err, result) {
      assert.equal(null, err);
      console.log('Item deleted');
      db.close();
    });
  });

  res.redirect('faculty'); // restart page

});

module.exports = router;
