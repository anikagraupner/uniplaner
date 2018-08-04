"use strict";

// creating map by using mapbox
L.mapbox.accessToken = 'pk.eyJ1IjoiYW5pa2FnIiwiYSI6ImNqaWszMHZkYTAxcnYzcXN6OWl3NW5vdHkifQ.LeZkk6ZXp8VN1_PuToqTVA';
  var map = L.mapbox.map('map').setView([51.95, 7.61], 11);

// adding different layers to the map
L.control.layers({

  'Mapbox Streets': L.mapbox.tileLayer('mapbox.streets-basic').addTo(map),
  'Mapbox Satellite': L.mapbox.tileLayer('mapbox.satellite'),
  'Mapbox Dark': L.mapbox.tileLayer('mapbox.dark'),
  'Mapbox Light': L.mapbox.tileLayer('mapbox.light')

}).addTo(map);

// leaflet draw plugin for mapbox
// see: https://www.mapbox.com/bites/00022/
var featureGroup = L.featureGroup().addTo(map);

var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: featureGroup
  }
}).addTo(map);

map.on('draw:created', function(e) {
    featureGroup.addLayer(e.layer);
});

/**
 * @desc upload function for geojson files from a textfield which then will be added to the map
 *
 */
function loadText(){

  var inhalt = document.getElementById("text").value;
  if (inhalt == ""){
    alert("Please enter your geojson!");
  } else {

      try {

        var textJSON = JSON.parse(this.inhalt);
        console.log(textJSON);
        L.geoJSON(textJSON).addTo(map);

      } catch (e) {

        alert("Your entry is not JSON conform!")

      }


  }


}

/**
*@desc function to load a geoJSON with and URL and upload it into the map
*/
function loadURL(){

  var url = document.getElementById("input").value;
  console.log(url);
  $.ajax({
    type: "GET",
    url: url,
    success: function(data){
      console.log(data);
      if(data == ""){
        alert("The loaded file is empty");
      } else {
          var geoJSON = JSON.parse(data);
          L.geoJSON(geoJSON).addTo(map);}

    },
    error: function(){
      alert("Error loading the data! Check your URL!");
    }
  })
}
