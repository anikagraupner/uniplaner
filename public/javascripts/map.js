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
 * with check of mistakes in the textfield input
 *
 */
function loadText(){

  var inhalt = document.getElementById("text").value;
  if (inhalt == ""){
    alert("Please enter your geojson!");
  } else {

      try {

        var textJSON = JSON.parse(inhalt);
        console.log(textJSON);

        if(typeof textJSON.features[0].properties.name== "undefined" || typeof textJSON.features[0].properties.img== "undefined"){

          alert("Enter a name for your Institute or check the titles of your properties!");

        } else{

          L.geoJSON(textJSON).addTo(map);
          console.log("Content of textfield is added to map!");

        }

      } catch (e) {

        alert("Your entry is not JSON conform! Check your syntax and (geometry)types!")

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

          try{

             var urlJSON = JSON.parse(data);

             console.log(urlJSON);

             if(typeof urlJSON.features[0].properties.name== "undefined" || typeof urlJSON.features[0].properties.img== "undefined"){

               alert("Your url input has wrong or missing attributes!");

             } else{

               L.geoJSON(urlJSON).addTo(map);
               console.log("Content of the URL is added to map!");

              }

          } catch (e) {

            alert("The content of the URL is not JSON conform! Check your syntax and (geometry)types!")

          }

      }

    },
    error: function(){
      alert("Error loading the data! Check your URL!");
    }
  })
}
