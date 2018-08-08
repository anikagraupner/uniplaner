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
*@desc: function which adds the geometry from the saved geojson file to the map
* and makes it editable
*/
function JSON2Map(geojson, _id){

    console.log(geojson);
    console.log(_id);
    document.getElementById("outputid").value = _id;
    document.getElementById("iddelete").value = _id;
    document.getElementById("outputname").value = geojson.features[0].properties.name;
    document.getElementById("outputimg").value = geojson.features[0].properties.img;

    // make the geometry editable
    // see: https://stackoverflow.com/questions/23892981/load-geojson-in-mapbox-for-editing-with-leaflet-draw
    L.geoJson(geojson, {
      onEachFeature: function (feature, layer) {
        featureGroup.addLayer(layer);
      }
    });
}

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
 * @desc upload function for geojson files from a textfield
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

/**
*@desc function which disable the "Save in Database" buttons
* important, because the mistakes have to be checked first
*/
function disableBtn(){

  document.getElementById("btn1").disabled = true;
  document.getElementById("btn2").disabled = true;

}

/**
*@desc function which disable or enable the "Save in Database" button of the map input
* no saving without a name
*/
function enableBtn(){

  if(document.getElementById("inputname").value == ""){

    document.getElementById("btn3").disabled = true;

  } else{

    document.getElementById("btn3").disabled = false;

  }

}
