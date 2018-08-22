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

function disableInputs(){

  if(document.getElementById("routename").value != ""){

    document.getElementById("routestart").disabled = true;
    document.getElementById("routeend").disabled = true;

  } else if (document.getElementById("routestart").value != "") {

      document.getElementById("routename").disabled = true;
      document.getElementById("routeend").disabled = true;

  } else if (document.getElementById("routeend").value != "") {

    document.getElementById("routestart").disabled = true;
    document.getElementById("routename").disabled = true;

  } else{

    document.getElementById("routename").disabled = false;
    document.getElementById("routestart").disabled = false;
    document.getElementById("routeend").disabled = false;
  }
}

$('#routename, #routestart, #routeend').on('autocompleteselect', function (e, ui) {

document.getElementById("btn3").disabled = false;
document.getElementById("btn2").disabled = false;
document.getElementById("btn1").disabled = true;

$.ajax({
  type: 'GET',
  url: "./loadRoute",
  success: function(result){

    // add the institute which was selected to the map
    $.each(result.route, function (i) {

      // compare input (select bar) with the names in result
      if(document.getElementById('routename').value == result.route[i].route.name ||
         document.getElementById('routestart').value == result.route[i].route.startpoint ||
         document.getElementById('routeend').value == result.route[i].route.endpoint){

        var s = result.route[i].route.startpoint;
        console.log(s);
        var e = result.route[i].route.endpoint;
        var geocoder = new L.Control.Geocoder.Nominatim();

        geocoder.geocode(s, function(results) {
        var latLngS= new L.LatLng(results[0].center.lat, results[0].center.lng);
        console.log(latLngS);

          geocoder.geocode(e, function(results) {
          var latLngE= new L.LatLng(results[0].center.lat, results[0].center.lng);
          console.log(latLngE);

          map.removeControl(control);

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
