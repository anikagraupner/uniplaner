"use strict";

var express = require('express'); //Express functionality
var router = express.Router(); //attaching a router variable to Express's router method
var mongo = require('mongodb'); //MongoDB
var objectId = require('mongodb').ObjectID; //ID for DB
var assert = require('assert'); //used to connect to database or for operations to check if everything is right
var url = 'mongodb://localhost:27017/uniplaner'; // path for database



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

/* saved_subject_areas. */
router.get('/edit_institute', function(req, res) {
  res.render('edit_institute', { title: 'Edit an institute!' });
});

/* saved_subject_areas. */
router.get('/saved_institutes', function(req, res) {
  res.render('saved_institutes', { title: 'Saved institutes!' });
});

/* saved_subject_areas. */
router.get('/canteens', function(req, res) {
  res.render('canteens', { title: 'Canteens!' });
});



/* insert institutes with drawing in the map */
router.post('/insertMap', function(req, res, next){

  console.log("Jetzt gehts los!");
  var mapfile = {
    name: req.body.inputname,
    geojson : req.body.draw};
  console.log(mapfile);
  mongo.connect(url, function(err, db) { // connect to the database
  assert.equal(null, err); // check if there is an error
  db.db('uniplaner').collection('institutes').insertOne(mapfile, function(err, result) { //name of the database-collection, one insert
    assert.equal(null, err); // check if there is an error
    console.log('Mapfile inserted');
    db.close();
});

});

res.redirect('institute'); // restart page

});

/* insert institutes from textfield into the database collection "institutes"*/
router.post('/insertText', function(req, res, next){

  console.log('yeah!');
  var text = {
    name: req.body.name,
    geojson : req.body.text};
  console.log(text);
  mongo.connect(url, function(err, db) { // connect to the database
  assert.equal(null, err); // check if there is an error
  db.db('uniplaner').collection('institutes').insertOne(text, function(err, result) { //name of the database-collection, one insert
    assert.equal(null, err); // check if there is an error
    console.log('Text inserted');
    db.close();
  });
});

res.redirect('institute'); // restart page
});;

/*save the geojson from the URL input in the database*/
/*npm install request save*/
router.post('/insertURL', function(req, res, next){

  var url = {
    name: req.body.name,
    geojson : req.body.inputurl}; //gets the url which is added on the webpage
  console.log(url);
  /* see: https://stackoverflow.com/questions/16482600/node-js-cannot-find-module-request*/
  /* request to get the content of the file of the URL*/
  var request = require('request');
  request.get(url, function (error, response, body) {
    if (!error && response.statusCode == 200) { // if there is no error
        var txt = body;
        var db = req.db;
        var collection = db.get('institutes');
        // Submit to the DB
        collection.insert({
        "geojson" : txt
        }, function (err, doc) {
          if (err) {
            // If it failed, return error
            res.send("There was a problem adding the file to the database.");
          }
          else {
            // And forward to success page
            res.redirect("institute");
        }
        });

    }
});

res.redirect("institute");

});

// load the data from the institutes collection to edit_institute
router.get('/get-datatwo', function(req, res) {
    var db = req.db;
    var collection = db.get('institutes');// tells the app which collection should be used
    collection.find({},{},function(e,docs){// do a find
        console.log(docs);
        res.render('saved_institutes', {// render of saved_faculties.jade
            'institute' : docs// passing the database documents to the variable faculty
        });
    });

});

/* get the ID and the new geojson from the edited institutes
/* see: https://github.com/mschwarzmueller/nodejs-basics-tutorial */
router.post('/updateinst', function(req, res, next) {
  var updatefile = {geojson : req.body.updatejson};
  var id = req.body.outputid;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.db('uniplaner').collection('institutes').updateOne({"_id": objectId(id)}, {$set: updatefile}, function(err, result) {
      assert.equal(null, err);
      console.log('Institute updated');
      db.close();
    });
  });

  res.redirect('edit_institute'); // restart page

});

/* get the form-data from the subject areas from mongodb */
/* see: https://github.com/mschwarzmueller/nodejs-basics-tutorial */
router.post('/deleteinst', function(req, res, next) {
  var id = req.body.iddelete;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.db('uniplaner').collection('institutes').deleteOne({"_id": objectId(id)}, function(err, result) {
      assert.equal(null, err);
      console.log('Institute deleted');
      db.close();
    });
  });

  res.redirect('edit_institute'); // restart page

});



/* save the form-data of the faculties to mongodb */
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

// using that db connection to fill the docs variable with database documents
router.get('/get-data', function(req, res) {
    var db = req.db;
    var collection = db.get('faculties');// tells the app which collection should be used
    collection.find({},{},function(e,docs){// do a find
        console.log(docs);
        res.render('saved_faculties', {// render of saved_faculties.jade
            'varfaculty' : docs// passing the database documents to the variable faculty
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
