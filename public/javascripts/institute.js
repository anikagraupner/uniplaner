"use strict";

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

/* leaflet draw plugin for mapbox */
/* see: https://www.mapbox.com/bites/00022/ */
var featureGroup = L.featureGroup().addTo(map);

var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: featureGroup
  },
  // disable other geometries (only Polygon can be drawn)
  draw: {
    circle: false,
    line: false,
    polyline: false,
    rectangle: false,
    marker: false
  }
}).addTo(map);

var json; // global variable for the geometry on the map (created or edited)

map.on('draw:created', function(e) {
    featureGroup.addLayer(e.layer);
    json = e.layer.toGeoJSON(); // save new geometry in variable json
});

map.on('draw:edited', function(e) {
    json = e.layers.toGeoJSON(); // save edited geometry in variable json
});



/*
* function to save a new institute in the database (inputfields, map)
* sending data to the server (collection: institutes)
*/
function insertInstMap(){

  // no saving without a name
  if(document.getElementById("inputname").value == ""){

    JL("mylogger").error("Data of the institute was not send to database.");
    alert("Error: Please enter a name!");

    // no saving without an url
  } else if(document.getElementById("img").value == ""){

      JL("mylogger").error("Data of the institute was not send to database.");
      alert("Error: Please enter a picture url!");

    // no saving without a geometry
  } else if(json == undefined){

      JL("mylogger").error("Data of the institute was not send to database.");
      alert("Error: Please draw the geometry of the institute!");

  // send new institute to the server
  } else {

      // creating a json conform object with the data inputs and the geometry from institute.jade
      console.log(json);
      var name = document.getElementById("inputname").value;
      var img = document.getElementById("img").value;
      var type = "FeatureCollection";
      var features = [];
      features.push(json);
      console.log(features);
      json.properties = {name, img};
      var newInstitute = {type, features};
      var data = JSON.stringify(newInstitute);
      console.log(data);

      JL("mylogger").info("Data was sent to database.");
      alert("New institute was sucessfully saved!");

      // dataType and contentType important for right sending of the json
      $.ajax({
        type: 'POST',
        data: data,
        dataType: "json",
        contentType: 'application/json',
        url: "./insertInstMap",
      });
    }
    location.reload(true);
}


/*
* function to save a new institute in the database (textfield)
* sending data to the server (collection: institutes)
*/
function insertInstText(){

  var content = document.getElementById("text").value;

  // content of the textfield must not be empty
  if (content == ""){

    alert("Your input is empty");
    JL("mylogger").error("Data of the institute was not send to database.");

  } else {

      try {

        // when the input from the textfield could not be parsed --> catch
        var textJSON = JSON.parse(content);
        console.log(textJSON);
        var a = textJSON.features[0].geometry.coordinates[0].length;

        // needs a name attribute
        if(typeof textJSON.features[0].properties.name== "undefined"){

          JL("mylogger").error("Data of the institute was not send to database.");
          alert("Enter a property name or check the title of your name property!");

          // name must not be null
        } else if(textJSON.features[0].properties.name== ""){

          JL("mylogger").error("Data of the institute was not send to database.");
          alert("Enter a name for your institute!");

          // needs a img attribute
        } else if(typeof textJSON.features[0].properties.img== "undefined"){

          JL("mylogger").error("Data of the institute was not send to database.");
          alert("Enter a property 'img' (for image url) for your Institute or check the title of your url property!");

          // img must not be null
        } else if(textJSON.features[0].properties.img== ""){

          JL("mylogger").error("Data of the institute was not send to database.");
          alert("Enter a image url for your Institute!");

          // geometry type must be a Polygon
        } else if(textJSON.features[0].geometry.type !== "Polygon"){

          JL("mylogger").error("Data of the institute was not send to database.");
          alert("Your geometry type is wrong. Change it to Polygon!");

          // if everything is correct, data is send to database
        } else{

            var data = JSON.stringify(textJSON);
            console.log(data);

            JL("mylogger").info("Data was sent to database.");
            alert("New institute was sucessfully saved!");

            // dataType and contentType important for right sending of the json
            $.ajax({
              type: 'POST',
              data: data,
              dataType: "json",
              contentType: 'application/json',
              url: "./insertInstitute",
            });
          }

        // alerted if json.parse does not work, so the input is all in all not json conform
      } catch (e) {

        JL("mylogger").error("Data of the institute was not send to database.");
        alert("Your entry is not JSON conform! Check your syntax and (geometry)types!");
      }
  }
}



/*
* function to save a new institute in the database (URL)
* sending data to the server (collection: institutes)
*/
function insertInstURL(){

  var url = document.getElementById("inputURL").value;
  console.log(url);
  $.ajax({
    type: "GET",
    url: url,
    success: function(content){
      console.log(content);
      document.getElementById('inputurl').innerHTML = content;

      // content of the url must not be empty
      if (content == ""){

        alert("Your input is empty!");
        JL("mylogger").error("Data of the institute was not send to database.");

      } else {

          try {

            // when the input from the url could not be parsed --> catch
            var textJSON = JSON.parse(content);
            console.log(textJSON);

            // needs a name attribute
            if(typeof textJSON.features[0].properties.name== "undefined"){

              JL("mylogger").error("Data of the institute was not send to database.");
              alert("Enter a property name or check the title of your name property!");

              // name must not be null
            } else if(textJSON.features[0].properties.name== ""){

              JL("mylogger").error("Data of the institute was not send to database.");
              alert("Enter a name for your institute!");

              // needs a img attribute
            } else if(typeof textJSON.features[0].properties.img== "undefined"){

              JL("mylogger").error("Data of the institute was not send to database.");
              alert("Enter a property 'img' (for image url) for your Institute or check the title of your url property!");

              // img must not be null
            } else if(textJSON.features[0].properties.img== ""){

              JL("mylogger").error("Data of the institute was not send to database.");
              alert("Enter a image url for your Institute!");

              // geometry type must be a Polygon
            } else if(textJSON.features[0].geometry.type !== "Polygon"){

              JL("mylogger").error("Data of the institute was not send to database.");
              alert("Your geometry type is wrong. Change it to Polygon!");

              // if everything is correct, data is send to database
            } else{

                var data = JSON.stringify(textJSON);
                console.log(data);

                JL("mylogger").info("Data was sent to database.");
                alert("New institute was sucessfully saved!");

                // dataType and contentType important for right sending of the json
                $.ajax({
                  type: 'POST',
                  data: data,
                  dataType: "json",
                  contentType: 'application/json',
                  url: "./insertInstitute",
                });
              }

            // alerted if json.parse does not work, so the input is all in all not json conform
          } catch (e) {

            JL("mylogger").error("Data of the institute was not send to database.");
            alert("Your entry is not JSON conform! Check your syntax and (geometry)types!");
          }
      }
    },
    error: function(){
      alert("Error loading the data! Check your URL!");
    }
  })
}
