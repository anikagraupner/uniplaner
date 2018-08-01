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
 * @desc upload function for geojson files from a textfield which then will be added to the map.
 * @see https://www.w3schools.com/js/js_ajax_intro.asp
 */
function loadText(){

  var textJSON = document.getElementById("text").value;
  var inhalt = JSON.parse(textJSON);
  console.log(inhalt);
  L.geoJSON(inhalt).addTo(map);
  
}

/**
 * @desc upload function for geojson files from URL which then will be added to the map.
 * @see https://www.w3schools.com/js/js_ajax_intro.asp
 */
function loadURL() {
    var upload = document.getElementById("input").value;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var inhalt = this.responseText;
            inhalt = JSON.parse(inhalt);
            L.geoJSON(inhalt).addTo(map);
        }

    };
    xhttp.open("GET", upload, true);
    xhttp.send();
}
