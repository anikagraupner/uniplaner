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
