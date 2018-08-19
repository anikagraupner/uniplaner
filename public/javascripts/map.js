

function updateFaculty(name, shortcut, website, institutes, _id){

  console.log(name);

  document.getElementById("idup").value = _id;
  document.getElementById("nameup").value = name;
  document.getElementById("shortcutup").value = shortcut;
  document.getElementById("websiteup").value = website;
  document.getElementById("institutesup").value = institutes;
  document.getElementById("iddelete").value = _id;


}


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
*@desc edits the new geojson file with the edit data from the formular and the map
*/
function beforeSubmitUpdateInst() {

  console.log(json);
  json.features[0].properties.name = document.getElementById("outputname").value;
  json.features[0].properties.img = document.getElementById("outputimg").value;
  console.log(json);
  document.getElementById("updatejson").value = JSON.stringify(json);
  console.log(document.getElementById("updatejson").value);
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
               document.getElementById("nameurl").value = urlJSON.features[0].properties.name;
               console.log(document.getElementById("nameurl").value);
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
