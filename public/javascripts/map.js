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

var json;

map.on('draw:created', function(e) {
    featureGroup.addLayer(e.layer);
    json = e.layer.toGeoJSON();
});


/**
*@desc: jQuery Code to do this code first before the button submitted
*assigns the value of the hidden field the new geojson file created from the formular and the map
*/
function beforeSubmit() {

  console.log(json);
  var name = document.getElementById("inputname").value;
  var img = document.getElementById("img").value;
  var type = "FeatureCollection";
  var features = [];
  features.push(json);
  console.log(features);
  json.properties = {name, img};
  var newjson = {type, features};
  var stringjson = JSON.stringify(newjson);
  console.log(stringjson);
  document.getElementById("inputDraw").value = stringjson;

}

/**
 * @desc upload function for geojson files from a textfield which then will be added to the map
 * with check of mistakes in the textfield input
 *
 */
function testText(){

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

          document.getElementById("btn1").disabled = false;
          alert("Your input is flawless! Push 'Save in Database'!");

        }

      } catch (e) {

        alert("Your entry is not JSON conform! Check your syntax and (geometry)types!");

      }

  }

}

//L.geoJSON(textJSON).addTo(map);


/**
*@desc function to load a geoJSON with and URL and upload it into the map
*/
function testURL(){

  var url = document.getElementById("inputURL").value;
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

               document.getElementById("inputurl").innerHTML = JSON.stringify(urlJSON);
               document.getElementById("btn2").disabled = false;
               console.log("It works!");
               alert("Your input is flawless! Push 'Save in Database'!");

              }

          } catch (e) {

            alert("The content of the URL is not JSON conform! Check your syntax and (geometry)types!");

          }

      }

    },
    error: function(){
      alert("Error loading the data! Check your URL!");
    }
  })
}

function disableBtn(){

  document.getElementById("btn1").disabled = true;
  document.getElementById("btn2").disabled = true;

}

function enableBtn(){

  if(document.getElementById("inputname").value == ""){

    document.getElementById("btn3").disabled = true;

  } else{

    document.getElementById("btn3").disabled = false;

  }

}
