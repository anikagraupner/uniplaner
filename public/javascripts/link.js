/* Code for institute.jade, side for the permalinks */

"use strict";

// Debugging: all loggers log to both the server and the console
// See: https://github.com/Effizjens/Aufgabe_7/blob/master/public/javascripts/map.js
var ajaxAppender=JL.createAjaxAppender('ajaxAppender');
var consoleAppender=JL.createConsoleAppender('consoleAppender');
JL("mylogger").setOptions({"appenders": [ajaxAppender,consoleAppender]});

/* creating map by using mapbox */
L.mapbox.accessToken = 'pk.eyJ1IjoiYW5pa2FnIiwiYSI6ImNqaWszMHZkYTAxcnYzcXN6OWl3NW5vdHkifQ.LeZkk6ZXp8VN1_PuToqTVA';
  var map = L.mapbox.map('map').setView([51.95, 7.61], 11);

/* adding different layers to the map */
L.control.layers({

  'Mapbox Streets': L.mapbox.tileLayer('mapbox.streets-basic').addTo(map),
  'Mapbox Satellite': L.mapbox.tileLayer('mapbox.satellite'),
  'Mapbox Dark': L.mapbox.tileLayer('mapbox.dark'),
  'Mapbox Light': L.mapbox.tileLayer('mapbox.light')

}).addTo(map);


// special icon for institute markers
var instituteIcon = L.icon({
    iconUrl: '/images/institute.png',
    iconSize: [40, 40]});

/*
* function which creates permalinks for every institute (institute shown in the map and corresponding faculty)
*/
window.onload=function(){

//getting the data of the institutes from the server
$.ajax({
    type: 'GET',
    url: "./loadInstitute",

    success: function(result){

      JL("mylogger").info("Institute data was loaded from the database!");
      console.log(result);

      //create permalinks and add every institute to the map with marker and add corresponding faculty
      $.each(result.institute, function (i) {

        console.log("http://localhost:3000/institute#"+result.institute[i]._id+"");

        // permalink = localhost:300/institute with the hash value id of the institute
        if(document.location.href == "http://localhost:3000/institute#"+result.institute[i]._id+""){

            // insert the name of the Institute in the document as a header
            document.getElementById('nameinst').innerHTML = "<h2>" + result.institute[i].geojson.features[0].properties.name + "</h2>";
            // some variables to add geojson to the map and create a popup
            var b = result.institute[i].geojson;
            L.geoJSON(b).addTo(map);
            var c = result.institute[i].geojson;
            var d = c.features[0].geometry.coordinates[0][0];
            var lat = d[1];
            var lon = d[0];
            var marker = L.marker([lat, lon], {icon: instituteIcon}).addTo(map);
            var img = c.features[0].properties.img;
            var name = c.features[0].properties.name;
            // popup with name and image of the institute
            marker.bindPopup("<b>"+ name + "<b>:<br><img src='" + img + "'" + " class=popupImage " + "/>", {maxHeight: 250, maxWidth: "auto"});

            var zoom = 16;
            map.setView([lat, lon], zoom);

            // load the data of the faculties
            $.ajax({
                type: 'GET',
                url: "./loadFaculty",
                success: function(response){

                  console.log(response);
                  JL("mylogger").info("Faculty data was loaded from the database!");

                  // find the faculty, which has the name of the selected institute in its attribute institutes
                  $.each(response.faculty, function (j) {

                    var str = response.faculty[j].institutes;
                    var res = result.institute[i].geojson.features[0].properties.name;
                    console.log(str);
                    console.log(res);
                    var re = new RegExp(res, 'g');

                    if(str.match(re)){ // function to find string in a string, true when a same string is found

                      document.getElementById("faculty").innerHTML =
                        "<b>Belongs to faculty:</b>" + "<br><br> " +
                        response.faculty[j].name + "<br><br> " +
                        response.faculty[j].shortcut + "<br><br> " +
                        response.faculty[j].website + "<br><br> " +
                        response.faculty[j].institutes + "<br><br>";

                    } else {
                      j++;
                    }
              });
            },
              error: function(){
                JL("mylogger").error("Faculty could not be loaded from the database!");
                alert("Error: No connection to database!");
              }
            });
            } else {
              i++;}
        });
      },
      error: function(){
        JL("mylogger").error("Institute could not be loaded from the database!");
        alert("Error: No connection to database!");
      }
});
}
