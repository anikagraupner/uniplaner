// leider habe ich die Unittests mit Mocha (auch zeitlich) nicht richtig geschafft
// Probleme beim Benutzen von jsdom
// im folgenden eine Funktion aus meiner routing.js, die getestet werden kann

/*
* function which is called in the function for nearest canteen
* creates a geojson from the openmensa data to use this new geojson in the leaflet-knn function
* @param (data)
*/
function createGeoJson(data){

  var features = [];

  // puts name, id and coordinates of a canteen into the new geoJSON
  for(var i=0; i < data.length; i++){

    var lat = data[i].coordinates[0];
    var lon = data[i].coordinates[1];
    var name = data[i].name;
    var address = data[i].address;
    var id = data[i].id;
    var latlon = [];
    latlon.push(lon);
    latlon.push(lat);
    var newFeature = {"type":"Feature", "properties":{"id": id, "name":name, "address":address}, "geometry":{"type":"Point", "coordinates": latlon}};
    features.push(newFeature);

  }

  newGeojson = {"type":"FeatureCollection", "features":features};
  return newGeojson;

}

if(typeof exports !== 'undefined') {
    exports.createGeoJson = createGeoJson;}
