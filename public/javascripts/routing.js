"use strict";

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

  // if no route was created
  if(route == undefined){
    JL("mylogger").error("Data was not sent to the database.");
    alert("Error: Please create a route!");
  } else{

      // some necessary variables
      var name = route.name;
      var i = route.waypoints.length;
      var start = route.waypoints[0].latLng;
      var lat = start.lat;
      var lon = start.lng;
      var end = route.waypoints[i-1].latLng;
      var lat2 = end.lat;
      var lon2 = end.lng;

      // no name
      if(name == "" || name == undefined){

        JL("mylogger").error("Data was not sent to the database.");
        alert("Error: Something went wrong. Your route has no name! Please create the route again!");
        location.reload(true);

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

        // it was necessary to use reverse geocoding, because when a marker is moved, this waypoint has no more name
        // instead the coordinates are stored in variables and correspondingly geocoded in reverse
        // see: view-source:http://bl.ocks.org/ThomasG77/raw/26e61508217ba86a04c19a67cbda0e99/

        // startpoint
        fetch('http://nominatim.openstreetmap.org/reverse?format=json&lon=' + lon + '&lat=' + lat).then(function(response) {
          return response.json();
        }).then(function(json) {

            console.log(json);
            var adressS = json.display_name;
            console.log(adressS);

          // endpoint
          fetch('http://nominatim.openstreetmap.org/reverse?format=json&lon=' + lon2 + '&lat=' + lat2).then(function(response) {
            return response.json();
          }).then(function(json) {

              console.log(json);
              var adressE = json.display_name;
              console.log(adressE);

              var newRoute = {"name":name, "startpoint":adressS, "endpoint":adressE};
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

          });
        })
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
      console.log(result);

        // create an array with the names of the saved institutes
        var namearray = [];
        $.each(result.route, function (i) {
              namearray.push(result.route[i].route.name);

              // jquery autocomplete
              $( "#routename").autocomplete({
              source: namearray});
        });
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
      console.log(result);

      // create an array with the names of the saved institutes
      var startarray = [];
      $.each(result.route, function (i) {
            startarray.push(result.route[i].route.startpoint);
      });

      // jquery autocomplete
      $( "#routestart").autocomplete({
      source: startarray});

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
      console.log(result);

      // create an array with the names of the saved institutes
      var endarray = [];
      $.each(result.route, function (i) {
            endarray.push(result.route[i].route.endpoint);
      });

      // jquery autocomplete
      $( "#routeend").autocomplete({
      source: endarray});

      }
});

/*
* function to enable and diable the input search fields to guarantee that the user types in only one field
*/
function disableInputs(){

  if(document.getElementById("routename").value != ""){

    document.getElementById("routestart").disabled = true;
    document.getElementById("routeend").disabled = true;
    document.getElementById("loadinstitute").disabled = true;

  } else if (document.getElementById("routestart").value != "") {

      document.getElementById("routename").disabled = true;
      document.getElementById("routeend").disabled = true;
      document.getElementById("loadinstitute").disabled = true;

  } else if (document.getElementById("routeend").value != "") {

    document.getElementById("routestart").disabled = true;
    document.getElementById("routename").disabled = true;
    document.getElementById("loadinstitute").disabled = true;

  } else if (document.getElementById("loadinstitute").value != "") {

    document.getElementById("routestart").disabled = true;
    document.getElementById("routename").disabled = true;
    document.getElementById("routeend").disabled = true;

  } else{

    document.getElementById("routename").disabled = false;
    document.getElementById("routestart").disabled = false;
    document.getElementById("routeend").disabled = false;
    document.getElementById("loadinstitute").disabled = false;
  }
}

var control2; // control vaiable for new route control in the following functions


/*
* function to upload a saved route from the database into the map
*/
$('#routename, #routestart, #routeend').on('autocompleteselect', function (e, ui) {

  // deletes a route in a map before adding a next one
  if(control2 != undefined){

    map.removeControl(control2);

  }

// enables and disables buttons
document.getElementById("btn3").disabled = false; // delete
document.getElementById("btn2").disabled = false; // update
document.getElementById("btn1").disabled = true; // save in DB

// load the route data with request to the server
$.ajax({
  type: 'GET',
  url: "./loadRoute",
  success: function(result){

    $.each(result.route, function (i) {

      // compare input (select bar) with the names in result
      if(document.getElementById('routename').value == result.route[i].route.name ||
         document.getElementById('routestart').value == result.route[i].route.startpoint ||
         document.getElementById('routeend').value == result.route[i].route.endpoint){

        // the startpoint and endpoint are addresses and have to be gecode to coordinates to add the route to the map again
        var s = result.route[i].route.startpoint;
        console.log(s);
        var e = result.route[i].route.endpoint;
        var geocoder = new L.Control.Geocoder.Nominatim();

        // nominatim geocoder
        // https://stackoverflow.com/questions/30934341/leaflet-geosearch-get-lon-lat-from-address
        // geocode startpoint
        geocoder.geocode(s, function(results) {
        var latLngS= new L.LatLng(results[0].center.lat, results[0].center.lng);
        console.log(latLngS);

          // geocode endpoint
          geocoder.geocode(e, function(results) {
          var latLngE= new L.LatLng(results[0].center.lat, results[0].center.lng);
          console.log(latLngE);

          // remove control from a new route (inputfields)
          map.removeControl(control);

          // add a new control / the searched route to the map
          var control2 = L.Routing.control({
                  router: new L.routing.mapbox('pk.eyJ1IjoiYW5pa2FnIiwiYSI6ImNqaWszMHZkYTAxcnYzcXN6OWl3NW5vdHkifQ.LeZkk6ZXp8VN1_PuToqTVA'),
                  waypoints: [
                   L.latLng(latLngS.lat,latLngS.lng),
                   L.latLng(latLngE.lat,latLngE.lng)
               ],
                  routeWhileDragging: false,
                  geocoder: L.Control.Geocoder.nominatim()
              })
              .on('routeselected', function(e) {
                  route = e.route;
              })
              .addTo(map);
          });
        });

        } else {

        i++;
      }
      });
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
    }
});


var newGeojson; // global variable to create a geojson from the openmensa data

/*
* function to get the nearest canteen to an institute and calculate the route in the map
*/
$('#loadinstitute').on('autocompleteselect', function (e, ui) {

  // enable and disable buttons
  document.getElementById("btn3").disabled = true; // update
  document.getElementById("btn2").disabled = true; // delete
  document.getElementById("btn1").disabled = false; // save

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

        // calls the function to create a geojson from the data
        createGeoJson(data);
      },
      error: function (data) {
        handleError(data);
      }
  });

  // created geojson from the function
  console.log(newGeojson);

  $.ajax({
      type: 'GET',
      url: "./loadInstitute",
      success: function(result){

        // first searching for the selected institute
        $.each(result.institute, function (i) {

          // for the seselcted institute
          if(document.getElementById('loadinstitute').value == result.institute[i].geojson.features[0].properties.name){

            var d = result.institute[i].geojson.features[0].geometry.coordinates[0][0];
            var lat = d[1];
            console.log(lat);
            var lon = d[0];
            console.log(lon);

            // leaflet knn-function
            // finds the nearest point from multiple points in a geojson file (gj, canteendata)
            // to one point (selected institute)
            var gj = L.geoJson(newGeojson);
            var nearest = leafletKnn(gj).nearest([lon, lat], 15);

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

        } else{
            i++;
        }
      });
    }
  });

});

/*
* function which is called in the function for nearest canteen
* creates a geojson from the openmensa data to use this new geojson in the leaflet-knn function
* @param (data)
*/
function createGeoJson(data){

  var features = [];

  // puts name, id and coordinates of a canteen into the new geoJSON
  for(var i=0; i < data.length; i++){

    console.log(data);
    var lat = data[i].coordinates[0];
    var lon = data[i].coordinates[1];
    var name = data[i].name;
    var id = data[i].id;
    var latlon = [];
    latlon.push(lon);
    latlon.push(lat);
    console.log(latlon);
    var newFeature = {"type":"Feature", "properties":{"id": id, "name":name}, "geometry":{"type":"Point", "coordinates": latlon}};
    features.push(newFeature);

  }

  newGeojson = {"type":"FeatureCollection", "features":features};
  console.log(newGeojson);

}
