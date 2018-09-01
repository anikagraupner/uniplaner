
var expect = require('chai').expect; // add-on module chai for mocha
var routing = require('../public/javascripts/Unittest_ersatz/routing_ersatz'); // conecction to the js file, in which the testet function is

describe("createGeoJson", function() {

      it("is defined and has the right format", function() { // what should be testet

        // input data
        var data = [{"id":1,"name":"Mensa UniCampus Magdeburg","city":"Magdeburg","address":"Pfälzer Str. 1, 39106 Magdeburg","coordinates":[52.1396188273019,11.6475999355316]}];

        // run function with input data
        var result = routing.createGeoJson(data);

        // variable has to be returned
        return result;

        // result should be the same than the given geoJSON
        expect(result).to.equal({"type":"Feature", "properties":{"id": 1, "name":"Mensa UniCampus Magdeburg", "address":"Pfälzer Str. 1, 39106 Magdeburg"}, "geometry":{"type":"Point", "coordinates": [52.1396188273019,11.6475999355316]}});
      });
});
