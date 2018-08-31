
var jsdom = require('mocha-jsdom');
var assert = require('assert');
var expect = require('chai').expect;
JL = require('../public/javascripts/libraries/jsnlog.min');
L = require('../public/javascripts/libraries/leaflet');
var routing = require('../public/javascripts/routing');


describe("createGeoJson", function() {

      jsdom()

      it("is defined", function() {
        var data = [{"id":1,"name":"Mensa UniCampus Magdeburg","city":"Magdeburg","address":"Pfälzer Str. 1, 39106 Magdeburg","coordinates":[52.1396188273019,11.6475999355316]}];
        var result = routing.createGeoJson(data);
        return result;
        expect(result).to.equal({"type":"Feature", "properties":{"id": 1, "name":"Mensa UniCampus Magdeburg", "address":"Pfälzer Str. 1, 39106 Magdeburg"}, "geometry":{"type":"Point", "coordinates": [52.1396188273019,11.6475999355316]}});
      });
});
