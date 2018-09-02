/* code for routing.jade */

"use strict";

// Debugging: all loggers log to both the server and the console
// See: https://github.com/Effizjens/Aufgabe_7/blob/master/public/javascripts/map.js
var ajaxAppender=JL.createAjaxAppender('ajaxAppender');
var consoleAppender=JL.createConsoleAppender('consoleAppender');
JL("mylogger").setOptions({"appenders": [ajaxAppender,consoleAppender]});

// creating map by using mapbox
L.mapbox.accessToken = 'pk.eyJ1IjoiYW5pa2FnIiwiYSI6ImNqaWszMHZkYTAxcnYzcXN6OWl3NW5vdHkifQ.LeZkk6ZXp8VN1_PuToqTVA';
  var map = L.mapbox.map('map').setView([51.96, 7.61], 13);

// adding different layers to the map
L.control.layers({

  'Mapbox Streets': L.mapbox.tileLayer('mapbox.streets-basic').addTo(map),
  'Mapbox Satellite': L.mapbox.tileLayer('mapbox.satellite'),
  'Mapbox Dark': L.mapbox.tileLayer('mapbox.dark'),
  'Mapbox Light': L.mapbox.tileLayer('mapbox.light')

}).addTo(map);

var route;

//loads a textfield in the map with which the user can navigate to a special place
//the geocoder references addresses and coordinates
L.Control.geocoder().addTo(map);

//initializes the control and adds it to the map (using mapbox)
var control = L.Routing.control({
        router: new L.routing.mapbox('pk.eyJ1IjoiYW5pa2FnIiwiYSI6ImNqaWszMHZkYTAxcnYzcXN6OWl3NW5vdHkifQ.LeZkk6ZXp8VN1_PuToqTVA'),
        routeWhileDragging: false,
        geocoder: L.Control.Geocoder.nominatim()
    })
    .on('routeselected', function(e) {
        route = e.route;
    })
    .addTo(map);



/*
* function which send the name, the startpoint and the endpoint of a route to the server
* to save it in the Database
*/
function insertRoute(){

  console.log(route);
  // if no route was created
  if(route == undefined){
    JL("mylogger").error("Data was not sent to the database.");
    alert("Error: Please create a route!");
  } else{

    var i = route.waypoints.length;
    var name = document.getElementById('name').value;
    var start = route.waypoints[0].latLng;
    var end = route.waypoints[i-1].latLng;

    // no name
    if(name == "" || name == undefined){

      JL("mylogger").error("Data was not sent to the database.");
      alert("Please enter a name in the input field!");

    // no startpoint
    } else if(start == "" || start == undefined){

      JL("mylogger").error("Data was not sent to the database.");
      alert("Error: Something went wrong. Your route has no startpoint! Please create the route again!");
      location.reload(true);

    // no endpoint
    } else if(end == "" || end == undefined){

      JL("mylogger").error("Data was not sent to the database.");
      alert("Error: Something went wrong. Your route has no endpoint! Please create the route again!");
      location.reload(true);

    } else{

        // some necessary variables
        var lat = start.lat;
        var lon = start.lng;
        var lat2 = end.lat;
        var lon2 = end.lng;

        if(document.getElementById('start').value != "" && document.getElementById('end').value != ""){

          var adressS = document.getElementById('start').value;
          var adressE = document.getElementById('end').value;

          var newRoute = {"name":name, "startpoint":{"name":adressS, "coordinates":[lat, lon]}, "endpoint":{"name":adressE, "coordinates":[lat2, lon2]}};
          console.log(newRoute);
          var data = JSON.stringify(newRoute);
          console.log(data);
          JL("mylogger").info("Data of the route was sent to the database.");
          alert("Your route was succesfully saved!");

          // dataType and contentType important for right sending of the json
          $.ajax({
            type: 'POST',
            data: data,
            dataType: "json",
            contentType: 'application/json',
            url: "./insertRoute",

          });
          // setTimeout, because direct reloading causes the old faculty to yet be displayed in the search field
          setTimeout(function(){ location.reload(true); }, 1000);

        } else{

          JL("mylogger").error("Data was not sent to the database.");
          alert("Error: Enter addresses for startpoint and endpoint!");
        }
  }
}
}

/*
* function which gets the data of the route from the server
* creates an array with name, startpoint and endpoint
* source for jquery autocomplete
*/
$.ajax({
    type: 'GET',
    url: "./loadRoute",

    success: function(result){

      JL("mylogger").info("Route data was loaded from the database!");

      console.log(result);

        // create an array with the names of the saved institutes
        var namearray = [];
        $.each(result.route, function (i) {
              namearray.push(result.route[i].route.name);

              // jquery autocomplete
              $( "#routename").autocomplete({
              source: namearray});
        });
      },
        // error by loading routes data
        error: function(){
          JL("mylogger").error("Route data could not be loaded from the database!");

        }
});


/*
* function which gets the data of the route from the server
* creates an array with name, startpoint and endpoint
* source for jquery autocomplete
*/
$.ajax({
    type: 'GET',
    url: "./loadRoute",

    success: function(result){

      JL("mylogger").info("Route data was loaded from the database!");

      console.log(result);

      // create an array with the names of the saved institutes
      var startarray = [];
      $.each(result.route, function (i) {
            startarray.push(result.route[i].route.startpoint.name);
      });

      // jquery autocomplete
      $( "#routestart").autocomplete({
      source: startarray});

      },
        // error by loading routes data
        error: function(){
          JL("mylogger").error("Route data could not be loaded from the database!");

        }
});

/*
* function which gets the data of the route from the server
* creates an array with name, startpoint and endpoint
* source for jquery autocomplete
*/
$.ajax({
    type: 'GET',
    url: "./loadRoute",

    success: function(result){

      JL("mylogger").info("Route data was loaded from the database!");

      console.log(result);

      // create an array with the names of the saved institutes
      var endarray = [];
      $.each(result.route, function (i) {
            endarray.push(result.route[i].route.endpoint.name);
      });

      // jquery autocomplete
      $( "#routeend").autocomplete({
      source: endarray});

      },
        // error by loading routes data
        error: function(){
          JL("mylogger").error("Route data could not be loaded from the database!");

        }
});

/*
* function to empty the other input search fields
*/
function emptyField(){
  if(document.getElementById('routename').value != ""){
      document.getElementById('routestart').value = "";
      document.getElementById('routeend').value = "";
      document.getElementById('loadinstitute').value = "";
  } else if(document.getElementById('routestart').value != ""){
      document.getElementById('routeend').value = "";
      document.getElementById('routename').value = "";
      document.getElementById('loadinstitute').value = "";
  } else{
      document.getElementById('routestart').value = "";
      document.getElementById('routename').value = "";
      document.getElementById('loadinstitute').value = "";
  }
}

var control2; // control vaiable for new route control in the following functions

/*
* function to upload a saved route from the database into the map
*/
$('#routename, #routestart, #routeend').on('autocompleteselect', function (e, ui) {

  document.getElementById('btn2').disabled = false;
  document.getElementById('btn3').disabled = false;
  // deletes a route in a map before adding a next one
  if(control2 != undefined){

    map.removeControl(control2);

  };

  if(control != undefined){

    map.removeControl(control);

  };

// load the route data with request to the server
$.ajax({
  type: 'GET',
  url: "./loadRoute",
  success: function(result){

    JL("mylogger").info("Route data was loaded from the database!");

    $.each(result.route, function (i) {

      // compare input (select bar) with the names in result
      if(document.getElementById('routename').value == result.route[i].route.name ||
         document.getElementById('routestart').value == result.route[i].route.startpoint.name ||
         document.getElementById('routeend').value == result.route[i].route.endpoint.name){

         document.getElementById('id').value = result.route[i]._id;
         document.getElementById('updatename').value = result.route[i].route.name;
         document.getElementById('updatestart').value = result.route[i].route.startpoint.name;
         document.getElementById('updateend').value = result.route[i].route.endpoint.name;

          // add a new control / the searched route to the map
          control2 = L.Routing.control({
                  router: new L.routing.mapbox('pk.eyJ1IjoiYW5pa2FnIiwiYSI6ImNqaWszMHZkYTAxcnYzcXN6OWl3NW5vdHkifQ.LeZkk6ZXp8VN1_PuToqTVA'),
                  waypoints: [
                   L.latLng(result.route[i].route.startpoint.coordinates),
                   L.latLng(result.route[i].route.endpoint.coordinates)
               ],
                  routeWhileDragging: false,
                  geocoder: L.Control.Geocoder.nominatim()
              })
              .on('routeselected', function(e) {
                  route = e.route;
              })
              .addTo(map);

        } else {

        i++;
      }
      });
      // empty all input search fields
      document.getElementById('routestart').value = "";
      document.getElementById('routeend').value = "";
      document.getElementById('routename').value = "";
  },
    // error by loading routes data
    error: function(){
      JL("mylogger").error("Route data could not be loaded from the database!");

    }
});
});


/*
* function which gets the data of the institutes from the server
* creates an array with name of institutes
* source for jquery autocomplete
*/
$.ajax({
    type: 'GET',
    url: "./loadInstitute",

    success: function(result){

      JL("mylogger").info("Institute data was loaded from the database!");

      console.log(result);
      console.log(result.institute[0].geojson.features[0].properties.name);

      // create an array with the names of the saved institutes
      var namearray = [];
      $.each(result.institute, function (i) {
                namearray.push(result.institute[i].geojson.features[0].properties.name);
            });

      console.log(namearray);

      // jquery autocomplete
      $( "#loadinstitute" ).autocomplete({
      source: namearray});
    },
      // error by loading institutes data
      error: function(){
        JL("mylogger").error("Institutes data could not be loaded from the database!");

      }
});


var newGeojson; // global variable to create a geojson from the openmensa data

/*
* function to get the nearest canteen to an institute and calculate the route in the map
*/
$('#loadinstitute').on('autocompleteselect', function (e, ui) {

  // deletes a route in a map before adding a next one
  if(control2 != undefined){

    map.removeControl(control2);

  }

  // get the mensa data of the mensas in Münster from openmensa
  $.ajax({
      type: 'GET',
      url: "http://openmensa.org/api/v2/canteens/?near[lat]=51.954522&near[lng]=7.614505&near[dist]=15",
      async: false,
      success: function(data){

        JL("mylogger").info("Canteen data was loaded from the openmensa!");

        // calls the function to create a geojson from the data
        createGeoJson(data);
      },
      error: function (data) {
        handleError(data);
        JL("mylogger").error("Canteen data could not be loaded from the openmensa!");
        alert("Canteen data could not be loaded from the openmensa!");
      }
  });

  // created geojson from the function
  console.log(newGeojson);

  $.ajax({
      type: 'GET',
      url: "./loadInstitute",
      success: function(result){

        JL("mylogger").info("Institute data was loaded from the database!");

        // first searching for the selected institute
        $.each(result.institute, function (i) {

          // for the seselcted institute
          if(document.getElementById('loadinstitute').value == result.institute[i].geojson.features[0].properties.name){

            var d = result.institute[i].geojson.features[0].geometry.coordinates[0][0];
            var lat = d[1];
            console.log(lat);
            var lon = d[0];
            console.log(lon);

            var gj = L.geoJson(newGeojson);
            var nearest = nearestCanteen(gj, lon, lat);

            // add the marker of the institute and the marker of the mensa into the map
            console.log(nearest);
            var latS = d[1];
            var lngS = d[0];
            var latE = nearest[0].lat;
            var lngE = nearest[0].lon;

            // remove control from a new route (inputfields)
            map.removeControl(control);

            // adds a new control to the map (route between institute and canteen)
            control2 = L.Routing.control({
                    router: new L.routing.mapbox('pk.eyJ1IjoiYW5pa2FnIiwiYSI6ImNqaWszMHZkYTAxcnYzcXN6OWl3NW5vdHkifQ.LeZkk6ZXp8VN1_PuToqTVA'),
                    waypoints: [
                     L.latLng(latS, lngS),
                     L.latLng(latE, lngE)
                 ],
                    routeWhileDragging: false,
                    geocoder: L.Control.Geocoder.nominatim()
                })
                .on('routeselected', function(e) {
                    route = e.route;
                })
                .addTo(map);

              // name of the nearest institute into the map
              document.getElementById('canteen').innerHTML =
              "<b><i>The nearest canteen to your institute is: </i></b><br>"
              + nearest[0].layer.feature.properties.name;
              document.getElementById('end').value = nearest[0].layer.feature.properties.address;

        } else{
            i++;
        }
      });
    },
      // error by loading institutes data
      error: function(){
        JL("mylogger").error("Institutes data could not be loaded from the database!");
        
      }
  });

});

/*leaflet knn-function
*finds the nearest point from multiple points in a geojson file (gj, canteendata)
*to one point (selected institute)
*/
function nearestCanteen(gj, lon, lat){

  return leafletKnn(gj).nearest([lon, lat], 15);

}

/*
* function which is called in the function for nearest canteen
* creates a geojson from the openmensa data to use this new geojson in the leaflet-knn function
* @param (data)
*/
function createGeoJson(data){

  var features = [];

  // puts name, id and coordinates of a canteen into the new geoJSON
  for(var i=0; i < data.length; i++){

    var lat = data[i].coordinates[0];
    var lon = data[i].coordinates[1];
    var name = data[i].name;
    var address = data[i].address;
    var id = data[i].id;
    var latlon = [];
    latlon.push(lon);
    latlon.push(lat);
    var newFeature = {"type":"Feature", "properties":{"id": id, "name":name, "address":address}, "geometry":{"type":"Point", "coordinates": latlon}};
    features.push(newFeature);

  }

  newGeojson = {"type":"FeatureCollection", "features":features};
  return newGeojson;

}

if(typeof exports !== 'undefined') {
    exports.createGeoJson = createGeoJson;}


/*
* function to update a route with changed data
*/
function updateRoute(){

  console.log(route);
  // if no route was created
  if(route == undefined){
    JL("mylogger").error("Data was not sent to the database.");
    alert("Error: Please create a route!");
  } else{

    var i = route.waypoints.length;
    var name = document.getElementById('updatename').value;
    var start = route.waypoints[0].latLng;
    var end = route.waypoints[i-1].latLng;

    // no name
    if(name == "" || name == undefined){

      JL("mylogger").error("Data was not sent to the database.");
      alert("Please enter a name in the input field!");

    // no startpoint
    } else if(start == "" || start == undefined){

      JL("mylogger").error("Data was not sent to the database.");
      alert("Error: Something went wrong. Your route has no startpoint! Please create the route again!");
      location.reload(true);

    // no endpoint
    } else if(end == "" || end == undefined){

      JL("mylogger").error("Data was not sent to the database.");
      alert("Error: Something went wrong. Your route has no endpoint! Please create the route again!");
      location.reload(true);

    } else{

        // some necessary variables
        var lat = start.lat;
        var lon = start.lng;
        var lat2 = end.lat;
        var lon2 = end.lng;

        if(document.getElementById('updatestart').value != "" && document.getElementById('updateend').value != ""){

          var adressS = document.getElementById('updatestart').value;
          var adressE = document.getElementById('updateend').value;

          var id = document.getElementById("id").value;
          var newRoute = {"id":id, "route":{"name":name, "startpoint":{"name":adressS, "coordinates":[lat, lon]}, "endpoint":{"name":adressE, "coordinates":[lat2, lon2]}}};
          console.log(newRoute);
          var data = JSON.stringify(newRoute);
          console.log(data);
          JL("mylogger").info("Data of the route was sent to the database.");
          alert("Changed route was succesfully saved!");

          // dataType and contentType important for right sending of the json
          $.ajax({
            type: 'POST',
            data: data,
            dataType: "json",
            contentType: 'application/json',
            url: "./updateRoute",

          });
          // setTimeout, because direct reloading causes the old faculty to yet be displayed in the search field
          setTimeout(function(){ location.reload(true); }, 1000);

        } else{

          JL("mylogger").error("Data was not sent to the database.");
          alert("Error: Enter addresses for startpoint and endpoint!");
        }
  }
}
}

/*
* function to delete a route (only id is needed)
*/
function deleteRoute(){

  // security question before deleting the dataset
  var txt;
  var r = confirm("Are you sure you want to delete the selected Route?");
  if (r == false) {
      alert("Route was NOT deleted!")
  } else {

      var id = document.getElementById('id').value;
      var delRoute = {"id":id}

      // id is needed to delete the dataset
      if(delRoute.id == ""){

        JL("mylogger").error("No data to send to the database.");
        alert("Error: Please select a dataset with the search functions!")

      // send the id of the selected route to the server
      } else {

        var data = JSON.stringify(delRoute);
        console.log(data);
        JL("mylogger").info("Data of the route was sent to server to delete the dataset.");
        alert("The selected route was deleted!");

        // dataType and contentType important for right sending of the json
        $.ajax({
          type: 'POST',
          data: data,
          dataType: "json",
          contentType: 'application/json',
          url: "./deleteRoute",

        });
        // setTimeout, because direct reloading causes the old institute to yet be displayed in the search field
        setTimeout(function(){ location.reload(true); }, 1000);
      }
    }
}
