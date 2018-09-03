/*code for add_institute.jade and edit_institute.jade*/

"use strict";

// Debugging: all loggers log to both the server and the console
// See: https://github.com/Effizjens/Aufgabe_7/blob/master/public/javascripts/map.js
var ajaxAppender=JL.createAjaxAppender('ajaxAppender');
var consoleAppender=JL.createConsoleAppender('consoleAppender');
JL("mylogger").setOptions({"appenders": [ajaxAppender,consoleAppender]});

/* creating map by using mapbox */
L.mapbox.accessToken = 'pk.eyJ1IjoiYW5pa2FnIiwiYSI6ImNqaWszMHZkYTAxcnYzcXN6OWl3NW5vdHkifQ.LeZkk6ZXp8VN1_PuToqTVA';
  var map = L.mapbox.map('map').setView([51.96, 7.62], 13);

/* adding different layers to the map */
L.control.layers({

  'Mapbox Streets': L.mapbox.tileLayer('mapbox.streets-basic').addTo(map),
  'Mapbox Satellite': L.mapbox.tileLayer('mapbox.satellite'),
  'Mapbox Dark': L.mapbox.tileLayer('mapbox.dark'),
  'Mapbox Light': L.mapbox.tileLayer('mapbox.light')

}).addTo(map);

L.Control.geocoder().addTo(map);
var geocoder = L.Control.Geocoder.nominatim();

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
    marker: false,
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

  console.log(json);

  // no saving without a name
  if(document.getElementById("inputname").value == ""){

    JL("mylogger").error("Data of the institute was not send to database.");
    alert("Error: Please enter a name!");

    // no saving without an url
  } else if(document.getElementById("img").value == ""){

      JL("mylogger").error("Data of the institute was not send to database.");
      alert("Error: Please enter a picture url!");

    // no saving without a geometry
  } else if(json == undefined || json == null){

      JL("mylogger").error("Data of the institute was not send to database.");
      alert("Error: Please draw the geometry of the institute!");

  // send new institute to the server (if clause because sometimes while editing json becomes a feature collection)
  } else if(json.type != "FeatureCollection") {

      // creating a json conform object with the data inputs and the geometry from institute.jade
      console.log(json);
      var name = document.getElementById("inputname").value;
      var img = document.getElementById("img").value;
      var newInstitute = {type:"FeatureCollection", features:[
        json
      ]};
      newInstitute.features[0].properties = {name, img};
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
        url: "./insertInstitute",
      });
      // setTimeout, because direct reloading causes the old faculty to yet be displayed in the search field
      setTimeout(function(){ location.reload(true); }, 1000);

    }else {

        // creating a json conform object with the data inputs and the geometry from institute.jade
        console.log(json);
        json.features[0].properties.name = document.getElementById("inputname").value;
        json.features[0].properties.img = document.getElementById("img").value;
        var newJson = json;

        var data = JSON.stringify(newJson);
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
      // setTimeout, because direct reloading causes the new institute to not yet be displayed in the search field
      setTimeout(function(){ location.reload(true); }, 1000);
  }



/*
* function to save a new institute in the database (textfield)
* sending data to the server (collection: institutes)
*/
function insertInstText(){

  var content = document.getElementById("text").value;

  // content of the textfield must not be empty
  if (content == ""){

    alert("Error: Your input is empty");
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
          alert("Error: Enter a property name or check the title of your name property!");

          // name must not be null
        } else if(textJSON.features[0].properties.name== ""){

          JL("mylogger").error("Data of the institute was not send to database.");
          alert("Error: Enter a name for your institute!");

          // needs a img attribute
        } else if(typeof textJSON.features[0].properties.img== "undefined"){

          JL("mylogger").error("Data of the institute was not send to database.");
          alert("Error: Enter a property 'img' (for image url) for your Institute or check the title of your url property!");

          // img must not be null
        } else if(textJSON.features[0].properties.img== ""){

          JL("mylogger").error("Data of the institute was not send to database.");
          alert("Error: Enter a image url for your Institute!");

          // geometry type must be a Polygon
        } else if(textJSON.features[0].geometry.type !== "Polygon"){

          JL("mylogger").error("Data of the institute was not send to database.");
          alert("Error: Your geometry type is wrong. Change it to Polygon!");

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
            // setTimeout, because direct reloading causes the old faculty to yet be displayed in the search field
            setTimeout(function(){ location.reload(true); }, 1000);
          }

        // alerted if json.parse does not work, so the input is all in all not json conform
      } catch (e) {

        JL("mylogger").error("Data of the institute was not send to database.");
        alert("Error: Your entry is not JSON conform! Check your syntax and (geometry)types!");
      }
  }
}



/*
* function to save a new institute in the database (URL)
* sending data to the server (collection: institutes)
*/
function insertInstURL(){

  if(document.getElementById("inputURL").value == ""){

    JL("mylogger").error("Data of the institute was not send to database.");
    alert("Error: Please enter a URL!");

  } else{
    // jquery ajax function to load the content of the url
    var url = document.getElementById("inputURL").value;
    console.log(url);
    $.ajax({
      type: "GET",
      url: url, // url from the input field
      success: function(content){

        console.log(content);
        // shows the content on the document
        document.getElementById('inputurl').innerHTML = content;

        // content of the url must not be empty
        if (content == ""){

          JL("mylogger").error("Data of the institute was not send to database.");
          alert("Error: Your input is empty!");

        } else {

            try {

              // when the input from the url could not be parsed --> catch
              var textJSON = JSON.parse(content);
              console.log(textJSON);

              // needs a name attribute
              if(typeof textJSON.features[0].properties.name== "undefined"){

                JL("mylogger").error("Data of the institute was not send to database.");
                alert("Error: Enter a property name or check the title of your name property!");

                // name must not be null
              } else if(textJSON.features[0].properties.name== ""){

                JL("mylogger").error("Data of the institute was not send to database.");
                alert("Error: Enter a name for your institute!");

                // needs a img attribute
              } else if(typeof textJSON.features[0].properties.img== "undefined"){

                JL("mylogger").error("Data of the institute was not send to database.");
                alert("Error: Enter a property 'img' (for image url) for your Institute or check the title of your url property!");

                // img must not be null
              } else if(textJSON.features[0].properties.img== ""){

                JL("mylogger").error("Data of the institute was not send to database.");
                alert("Error: Enter a image url for your Institute!");

                // geometry type must be a Polygon
              } else if(textJSON.features[0].geometry.type !== "Polygon"){

                JL("mylogger").error("Data of the institute was not send to database.");
                alert("Error: Your geometry type is wrong. Change it to Polygon!");

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
                  // setTimeout, because direct reloading causes the old faculty to yet be displayed in the search field
                  setTimeout(function(){ location.reload(true); }, 1000);
                }

              // alerted if json.parse does not work, so the input is all in all not json conform
            } catch (e) {

              JL("mylogger").error("Data of the institute was not send to database.");
              alert("Error: Your entry is not JSON conform! Check your syntax and (geometry)types!");
            }
        }
      },
      // error if the url is not correct
      error: function(){
        alert("Error loading the data! Check your URL!");
      }
    })
  }
}


/*
* function which gets the data of the institutes from the server
* creates an array with name of institutes
* source for jquery autocomplete
*/
$.ajax({
    type: 'GET',
    url: "./loadInstitute",

    success: function(result){

      JL("mylogger").info("Data of the institute was sent to client side.");

      console.log(result);
      console.log(result.institute[0].geojson.features[0].properties.name);

      // create an array with the names of the saved institutes
      var namearray = [];
      $.each(result.institute, function (i) {
                namearray.push(result.institute[i].geojson.features[0].properties.name);
            });

      console.log(namearray);

      // jquery autocomplete
      $( "#searchinstitute" ).autocomplete({
      source: namearray});
    },
      // error by loading institute data
      error: function(){
        JL("mylogger").error("Institute data could not be loaded from the database!");
        alert("Error: No connection to database!");
      }
});


/*
* function which gets the data of the institutes from the server
* load the values to the input fields and the map on edit_institute.jade
* when the name of an institute is selected with jquery autocomplete
*/
$('#searchinstitute').on('autocompleteselect', function (e, ui) {

  // important if somebody changes the selected institute name, the old geometry in the map must be removed
  if(json !== undefined){ // json is only defined when a institute was already selected

    featureGroup.clearLayers();

  }

  $.ajax({
      type: 'GET',
      url: "./loadInstitute",
      success: function(result){

        JL("mylogger").info("Data of the institute was sent to client side.");

        $.each(result.institute, function (i) {

          if(document.getElementById('searchinstitute').value == result.institute[i].geojson.features[0].properties.name){

            // if name is the same as the input, the data of the institute is filled in the input fields
            document.getElementById('outputid').value = result.institute[i]._id;
            document.getElementById('outputname').value = result.institute[i].geojson.features[0].properties.name;
            document.getElementById('outputimg').value = result.institute[i].geojson.features[0].properties.img;

            // make the geometry editable when it is added to the map
            // see: https://stackoverflow.com/questions/23892981/load-geojson-in-mapbox-for-editing-with-leaflet-draw
            L.geoJson(result.institute[i].geojson, {
              onEachFeature: function (feature, layer) {
                featureGroup.addLayer(layer);
                json = result.institute[i].geojson; // json becomes defined
              }
            });

          } else {

            i++;
          }
        });
      },
        // error by loading institute data
        error: function(){
          JL("mylogger").error("Institute data could not be loaded from the database!");
          alert("Error: No connection to database!");
        }
    });
});




/*
* function to update the data of an already saved institute
* sending data to the server (collection: institutes)
*/
function updateInstitute(){

  // when the button is clicked without any content
  if(document.getElementById("outputid").value == ""){
    JL("mylogger").error("Data of the institute was not send to database.");
    alert("Error: Please select an institute with the search bar!");
  } else{

    // no saving without a name
    if(document.getElementById("outputname").value == ""){

      JL("mylogger").error("Data of the institute was not send to database.");
      alert("Error: Please enter a name!");

      // no saving without an url
    } else if(document.getElementById("outputimg").value == ""){

        JL("mylogger").error("Data of the institute was not send to database.");
        alert("Error: Please enter a picture url!");

      // no saving without a geometry
    } else if(json == undefined){

        JL("mylogger").error("Data of the institute was not send to database.");
        alert("Error: Please draw the geometry of the institute!");

      // if somebody deletes the old geometry and draws a new one (same procedure than insertInstitute())
    } else if(json.type != "FeatureCollection"){

      // creating a json conform object with the data input field and the geometry
      console.log(json);
      var name = document.getElementById("outputname").value;
      var img = document.getElementById("outputimg").value;
      var id = document.getElementById("outputid").value;
      var newInstitute = {type:"FeatureCollection", features:[
        json
      ]};
      newInstitute.features[0].properties = {name, img};
      console.log(newInstitute);
      var object = {id, geojson: newInstitute};
      var data = JSON.stringify(object);
      console.log(data);
      JL("mylogger").info("Data was sent to database.");
      alert("Changed institute was sucessfully saved!");

      // dataType and contentType important for right sending of the json
      $.ajax({
        type: 'POST',
        data: data,
        dataType: "json",
        contentType: 'application/json',
        url: "./updateInstitute",
      });

    // send new institute to the server, if the old geometry was onl edited with the edit button in the map
    } else {

        // creating a json conform object with the data inputs and the geometry from institute.jade
        console.log(json);
        var id = document.getElementById("outputid").value;
        json.features[0].properties.name = document.getElementById("outputname").value;
        json.features[0].properties.img = document.getElementById("outputimg").value;
        var newJson = {id, geojson: json};

        var data = JSON.stringify(newJson);
        console.log(data);
        JL("mylogger").info("Data was sent to database.");
        alert("Changed institute was sucessfully saved!");

        // dataType and contentType important for right sending of the json
        $.ajax({
          type: 'POST',
          data: data,
          dataType: "json",
          contentType: 'application/json',
          url: "./updateInstitute",
        });
      }
      // setTimeout, because direct reloading causes the new institute to not yet be displayed in the search field
      setTimeout(function(){ location.reload(true); }, 1000);
  }
}

/*
* function to delete an institute (only id is needed)
*/
function deleteInstitute(){

  // security question before deleting the dataset
  var txt;
  var r = confirm("Are you sure you want to delete the selected Institute?");
  if (r == false) {
      alert("Institute was NOT deleted!")
  } else {

      var id = document.getElementById('outputid').value;
      var delInstitute = {"id":id}

      // id is needed to delete the dataset
      if(delInstitute.id == ""){

        JL("mylogger").error("No data to send to the database.");
        alert("Error: Please select a dataset with the search function!")

      // send the id of the selected institute to the server
      } else {

        var data = JSON.stringify(delInstitute);
        console.log(data);
        JL("mylogger").info("Data of the institute was sent to server to delete the dataset.");
        alert("The selected institute was deleted!");

        // dataType and contentType important for right sending of the json
        $.ajax({
          type: 'POST',
          data: data,
          dataType: "json",
          contentType: 'application/json',
          url: "./deleteInstitute",

        });
        // setTimeout, because direct reloading causes the old institute to yet be displayed in the search field
        setTimeout(function(){ location.reload(true); }, 1000);
      }
    }
}
