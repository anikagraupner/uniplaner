"use strict";

var express = require('express'); //Express functionality
var router = express.Router(); //attaching a router variable to Express's router method
var mongo = require('mongodb'); //MongoDB
var objectId = require('mongodb').ObjectID; //object ID in DB
var assert = require('assert'); //used to connect to database or for operations to check if everything is right

/* see: https://github.com/Effizjens/Aufgabe_7/blob/master/routes/index.js */
/* logging: */
var JL = require('jsnlog').JL; //server
var jsnlog_nodejs = require('jsnlog-nodejs').jsnlog_nodejs; //console
var bodyParser = require('body-parser'); //parser

//var url = 'mongodb://localhost:27017/uniplaner'; //path database
var url = 'mongodb://nodetest2/uniplaner'; //path database


/* GET home page. */
router.get('/', function(req, res, next) {
  JL("mylogger").info("Home page called!");
  res.render('index', { title: 'Startpage!' });
});

/* GET legal notice. */
router.get('/imprint', function(req, res) {
  JL("mylogger").info("Legal notice called!");
  res.render('imprint', { title: 'Legal notice!' });
});

/* GET faculty. */
router.get('/faculty', function(req, res) {
  JL("mylogger").info("Faculty called!");
  res.render('faculty', { title: 'Add or edit a faculty!' });
});

/* GET add_institute. */
router.get('/add_institute', function(req, res) {
  JL("mylogger").info("Add Institute called!");
  res.render('add_institute', { title: 'Add an institute!' });
});

/* GET edit_institute */
router.get('/edit_institute', function(req, res) {
  JL("mylogger").info("Edit Institute called!");
  res.render('edit_institute', { title: 'Edit an institute!' });
});

/* GET facilities. */
router.get('/facilities', function(req, res) {
  JL("mylogger").info("Facilities called!");
  res.render('facilities', { title: 'Facilities of the WWU!' });
});

/* GET routing. */
router.get('/routing', function(req, res) {
  JL("mylogger").info("Routing called!");
  res.render('routing', { title: 'Routing!' });
});

/* GET institute. (for permalink) */
router.get('/institute', function(req, res) {
  JL("mylogger").info("Institute called!");
  res.render('institute', { title: 'Institute!' });
});

/*
* request when clicking button in 'faculty' to save data in DB
* sending the data to collection 'faculties'
* see: https://github.com/mschwarzmueller/nodejs-basics-tutorial
*/
router.post('/insertFaculty', function(req, res){

  // save sent data in a variable
  var faculty = req.body;
  console.log(faculty);

  mongo.connect(url, function(err, db) { // connect to the database
    assert.equal(null, err); // check if there is an error
    db.db('uniplaner').collection('faculties').insertOne(faculty, function(err, result) { //name of the database-collection, one insert
      assert.equal(null, err); // check if there is an error
      JL("mylogger").info("Faculty inserted!")
      db.close(); // close DB
    });
  });
});

/*
* function to load the whole data from collection 'faculties' and send it to client side
*/
router.get('/loadFaculty', function(req, res) {

  var db = req.db; // connection to database
  var collection = db.get('faculties');  // choosing collection
  collection.find({},{},function(e,docs){ // find all elements in the collection

    res.send({"faculty": docs}); // send them to client side
    JL("mylogger").info("Faculty data was sent to client side!")
  });
});

/*
* function for changing the data of a faculty
* see: https://github.com/mschwarzmueller/nodejs-basics-tutorial
*/
router.post('/updateFaculty', function(req, res, next) {

  // save sent data in a variable
  var changedData = {
    name: req.body.name,
    shortcut: req.body.shortcut,
    website: req.body.website,
    institutes: req.body.institutes
  };
  console.log(changedData);

  // save object id in a special variable
  var id = req.body.id;
  console.log(id);

  mongo.connect(url, function(err, db) { // connect to the database
    assert.equal(null, err); // check if there is an error
    // name of the database-collection, update the data of the element wich has the same id
    db.db('uniplaner').collection('faculties').updateOne({"_id": objectId(id)}, {$set: changedData}, function(err, result) {
      assert.equal(null, err); // check if there is an error
      JL("mylogger").info("Data was changed.");
      db.close(); // close DB
    });
  });
});

/*
* delete a faculty in the database collection faculties
* see: https://github.com/mschwarzmueller/nodejs-basics-tutorial
*/
router.post('/deleteFaculty', function(req, res, next) {

  // save id from the selected faculty on client side to a server side variable
  var id = req.body.id;
  console.log(id);

  mongo.connect(url, function(err, db) { // connect to the database
    assert.equal(null, err); // check if there is an error
    // name of the database-collection, delete the data of the element wich has the same id
    db.db('uniplaner').collection('faculties').deleteOne({"_id": objectId(id)}, function(err, result) {
      assert.equal(null, err); // check if there is an error
      JL("mylogger").info('Faculty was deleted');
      db.close(); // close DB
    });
  });
});



/*
* request when clicking button in 'institute' to save data in DB
* sending the data to collection 'institutes'
* see: https://github.com/mschwarzmueller/nodejs-basics-tutorial
*/
router.post('/insertInstitute', function(req, res, next){

  // save sent data in a variable
  var institute = {geojson: req.body};
  console.log(institute);

  mongo.connect(url, function(err, db) { // connect to the database
  assert.equal(null, err); // check if there is an error
    db.db('uniplaner').collection('institutes').insertOne(institute, function(err, result) { //name of the database-collection, one insert
      assert.equal(null, err); // check if there is an error
      JL("mylogger").info('Institute inserted');
      db.close(); // close DB
    });
  });
});

/*
* function to load the whole data from collection 'institutes' and send it to client side
*/
router.get('/loadInstitute', function(req, res) {

  var db = req.db; // connection to database
  var collection = db.get('institutes'); // collection institutes
  collection.find({},{},function(e,docs){ // find all elements in the collection

    console.log(docs);
    res.send({"institute": docs}); // send them to client side
    JL("mylogger").info("Institute data was sent to client side!");
  });
});


/*
* function for changing the data of a institute
* see: https://github.com/mschwarzmueller/nodejs-basics-tutorial
*/
router.post('/updateInstitute', function(req, res, next) {

  // save the sent data in variables
  var updateInst = {geojson : req.body.geojson};
  var id = req.body.id;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    // name of the database-collection, update the data of the element wich has the same id
    db.db('uniplaner').collection('institutes').updateOne({"_id": objectId(id)}, {$set: updateInst}, function(err, result) {
      assert.equal(null, err);
      JL("mylogger").info('Institute updated');
      db.close();
    });
  });
});

/*
* delete an institute in the database collection institutes
* see: https://github.com/mschwarzmueller/nodejs-basics-tutorial
*/
router.post('/deleteInstitute', function(req, res, next) {

  // save the sent data in variable
  var id = req.body.id;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    // name of the database-collection, delete the data of the element wich has the same id
    db.db('uniplaner').collection('institutes').deleteOne({"_id": objectId(id)}, function(err, result) {
      assert.equal(null, err);
      JL("mylogger").info('Institute deleted');
      db.close();
    });
  });
});

router.post('/insertRoute', function(req, res, next){

  // save sent data in a variable
  var route = {route: req.body};
  console.log(route);

  mongo.connect(url, function(err, db) { // connect to the database
  assert.equal(null, err); // check if there is an error
    db.db('uniplaner').collection('routes').insertOne(route, function(err, result) { //name of the database-collection, one insert
      assert.equal(null, err); // check if there is an error
      JL("mylogger").info('Route inserted');
      db.close(); // close DB
    });
  });
});

/*
* function to load the whole data from collection 'routes' and send it to client side
*/
router.get('/loadRoute', function(req, res) {

  var db = req.db; // connection to database
  var collection = db.get('routes'); // collection routes
  collection.find({},{},function(e,docs){ // find all elements in the collection

    res.send({"route": docs}); // send them to client side
    JL("mylogger").info("Route data was sent to client side!");
  });
});

/*
* function for changing the data of a route
* see: https://github.com/mschwarzmueller/nodejs-basics-tutorial
*/
router.post('/updateRoute', function(req, res, next) {

  // save the sent data in variables
  var updateroute = {route: req.body.route};
  console.log(updateroute);
  var id = req.body.id;
  console.log(id);

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    // name of the database-collection, update the data of the element wich has the same id
    db.db('uniplaner').collection('routes').updateOne({"_id": objectId(id)}, {$set: updateroute}, function(err, result) {
      assert.equal(null, err);
      JL("mylogger").info('Route updated');
      db.close();
    });
  });
});

/*
* delete a route in the database collection routes
* see: https://github.com/mschwarzmueller/nodejs-basics-tutorial
*/
router.post('/deleteRoute', function(req, res, next) {

  // save the sent data in variable
  var id = req.body.id;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    // name of the database-collection, delete the data of the element wich has the same id
    db.db('uniplaner').collection('routes').deleteOne({"_id": objectId(id)}, function(err, result) {
      assert.equal(null, err);
      JL("mylogger").info('Route deleted');
      db.close();
    });
  });
});

/* serverside logging with javascript
* source: https://github.com/Effizjens/Aufgabe_7/blob/master/routes/index.js
*/

// Ensure that the JSON objects received from the client get parsed correctly.
router.use(bodyParser.json())

/* jsnlog.js on the client by default sends log messages to /jsnlog.logger, using POST. */
router.post('*.logger', function (req, res) {
    jsnlog_nodejs(JL, req.body);

    // Send empty response. This is ok, because client side jsnlog does not use response from server.
    res.send('');
});


module.exports = router;
