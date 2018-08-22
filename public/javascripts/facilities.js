"use strict";

// creating map by using mapbox
L.mapbox.accessToken = 'pk.eyJ1IjoiYW5pa2FnIiwiYSI6ImNqaWszMHZkYTAxcnYzcXN6OWl3NW5vdHkifQ.LeZkk6ZXp8VN1_PuToqTVA';
  var map = L.mapbox.map('map').setView([51.96, 7.61], 13);

// adding different layers to the map
L.control.layers({

  'Mapbox Streets': L.mapbox.tileLayer('mapbox.streets-basic').addTo(map),
  'Mapbox Satellite': L.mapbox.tileLayer('mapbox.satellite'),
  'Mapbox Dark': L.mapbox.tileLayer('mapbox.dark'),
  'Mapbox Light': L.mapbox.tileLayer('mapbox.light')

}).addTo(map);

// special icon for the canteen popup
var canteenIcon = L.icon({
    iconUrl: '/images/canteen_icon.jpg',
    iconSize: [40, 40]});

/*
* function to get all positions of canteens in Muenster and their daily meals from openmensa
*/
$.ajax({
        type: "GET",
        url: "http://openmensa.org/api/v2/canteens/?near[lat]=51.954522&near[lng]=7.614505&near[dist]=15", //canteens near this coordinates with a radius of 15 km
        success: function(data){
        console.log(data);

          for(var i = 0; i<=11; i++){

            // get the coordinates of every canteen in Muenster and add them to the map
            var lat = data[i].coordinates[0];
            console.log(lat);
            var lon = data[i].coordinates[1];
            console.log(lon);
            var marker = L.marker([lat, lon], {icon: canteenIcon}).addTo(map);

            // get the id of every canteen in Muenster to retrieve their meals again with a request to openmensa
            var id = data[i].id;
            var url = "http://openmensa.org/api/v2/canteens/"+id+"/meals";
            $.ajax({
                    type: "GET",
                    url: url,
                    async: false,
                    success: function(meals){

                      // if therer is no data for a canteen, the canteen is closed
                      if(meals == ""){

                        marker.bindPopup("<b>" + data[i].name + "</b>" + ":" + "<br>Closed today!");

                      // different numbers of daily meals, all in all six "else"
                      // create an popup with the meals and prices
                      }else if(meals[0].meals.length == 6){

                        marker.bindPopup("<b>" + data[i].name + "</b>" + "<br><br>" + meals[0].meals[0].name + ":<br>" + "- Students: "
                        + meals[0].meals[0].prices.students + "<br>- Employees: " +  meals[0].meals[0].prices.employees + "<br>- Pupils: " +  meals[0].meals[0].prices.pupils
                        + "<br>- Others: " +  meals[0].meals[0].prices.others + "<br><br>" + meals[0].meals[1].name + ":<br>"+ "- Students: "
                        + meals[0].meals[1].prices.students + "<br>- Employees: " +  meals[0].meals[1].prices.employees + "<br>- Pupils: " +  meals[0].meals[1].prices.pupils
                        + "<br>- Others: " +  meals[0].meals[1].prices.others  + "<br><br>" + meals[0].meals[2].name + "<br>" + "- Students: "
                        + meals[0].meals[2].prices.students + "<br>- Employees: " +  meals[0].meals[2].prices.employees + "<br>- Pupils: " +  meals[0].meals[2].prices.pupils
                        + "<br>- Others: " +  meals[0].meals[2].prices.others + "<br><br>" + meals[0].meals[3].name + "<br>" + "- Students: "
                        + meals[0].meals[3].prices.students + "<br>- Employees: " +  meals[0].meals[3].prices.employees + "<br>- Pupils: " +  meals[0].meals[3].prices.pupils
                        + "<br>- Others: " +  meals[0].meals[3].prices.others+ "<br><br>" + meals[0].meals[4].name + "<br>" + "- Students: "
                        + meals[0].meals[4].prices.students + "<br>- Employees: " +  meals[0].meals[4].prices.employees + "<br>- Pupils: " +  meals[0].meals[4].prices.pupils
                        + "<br>- Others: " +  meals[0].meals[4].prices.others + "<br><br>" + meals[0].meals[5].name + "<br>" + "- Students: "
                        + meals[0].meals[5].prices.students + "<br>- Employees: " +  meals[0].meals[5].prices.employees + "<br>- Pupils: " +  meals[0].meals[5].prices.pupils
                        + "<br>- Others: " +  meals[0].meals[5].prices.others, {maxHeight: 200});

                      }else if(meals[0].meals.length == 5){

                        marker.bindPopup("<b>" + data[i].name + "</b>" + "<br><br>" + meals[0].meals[0].name + ":<br>" + "- Students: "
                        + meals[0].meals[0].prices.students + "<br>- Employees: " +  meals[0].meals[0].prices.employees + "<br>- Pupils: " +  meals[0].meals[0].prices.pupils
                        + "<br>- Others: " +  meals[0].meals[0].prices.others + "<br><br>" + meals[0].meals[1].name + ":<br>"+ "- Students: "
                        + meals[0].meals[1].prices.students + "<br>- Employees: " +  meals[0].meals[1].prices.employees + "<br>- Pupils: " +  meals[0].meals[1].prices.pupils
                        + "<br>- Others: " +  meals[0].meals[1].prices.others  + "<br><br>" + meals[0].meals[2].name + "<br>" + "- Students: "
                        + meals[0].meals[2].prices.students + "<br>- Employees: " +  meals[0].meals[2].prices.employees + "<br>- Pupils: " +  meals[0].meals[2].prices.pupils
                        + "<br>- Others: " +  meals[0].meals[2].prices.others + "<br><br>" + meals[0].meals[3].name + "<br>" + "- Students: "
                        + meals[0].meals[3].prices.students + "<br>- Employees: " +  meals[0].meals[3].prices.employees + "<br>- Pupils: " +  meals[0].meals[3].prices.pupils
                        + "<br>- Others: " +  meals[0].meals[3].prices.others+ "<br><br>" + meals[0].meals[4].name + "<br>" + "- Students: "
                        + meals[0].meals[4].prices.students + "<br>- Employees: " +  meals[0].meals[4].prices.employees + "<br>- Pupils: " +  meals[0].meals[4].prices.pupils
                        + "<br>- Others: " +  meals[0].meals[4].prices.others, {maxHeight: 200});

                      }else if(meals[0].meals.length == 4){

                        marker.bindPopup("<b>" + data[i].name + "</b>" + "<br><br>" + meals[0].meals[0].name + ":<br>" + "- Students: "
                        + meals[0].meals[0].prices.students + "<br>- Employees: " +  meals[0].meals[0].prices.employees + "<br>- Pupils: " +  meals[0].meals[0].prices.pupils
                        + "<br>- Others: " +  meals[0].meals[0].prices.others + "<br><br>" + meals[0].meals[1].name + ":<br>"+ "- Students: "
                        + meals[0].meals[1].prices.students + "<br>- Employees: " +  meals[0].meals[1].prices.employees + "<br>- Pupils: " +  meals[0].meals[1].prices.pupils
                        + "<br>- Others: " +  meals[0].meals[1].prices.others  + "<br><br>" + meals[0].meals[2].name + "<br>" + "- Students: "
                        + meals[0].meals[2].prices.students + "<br>- Employees: " +  meals[0].meals[2].prices.employees + "<br>- Pupils: " +  meals[0].meals[2].prices.pupils
                        + "<br>- Others: " +  meals[0].meals[2].prices.others + "<br><br>" + meals[0].meals[3].name + "<br>" + "- Students: "
                        + meals[0].meals[3].prices.students + "<br>- Employees: " +  meals[0].meals[3].prices.employees + "<br>- Pupils: " +  meals[0].meals[3].prices.pupils
                        + "<br>- Others: " +  meals[0].meals[3].prices.others, {maxHeight: 200});

                      } else if(meals[0].meals.length == 3) {

                        marker.bindPopup("<b>" + data[i].name + "</b>" + "<br><br>" + meals[0].meals[0].name + ":<br>" + "- Students: "
                        + meals[0].meals[0].prices.students + "<br>- Employees: " +  meals[0].meals[0].prices.employees + "<br>- Pupils: " +  meals[0].meals[0].prices.pupils
                        + "<br>- Others: " +  meals[0].meals[0].prices.others + "<br><br>" + meals[0].meals[1].name + ":<br>" + "- Students: "
                        + meals[0].meals[1].prices.students + "<br>- Employees: " +  meals[0].meals[1].prices.employees + "<br>- Pupils: " +  meals[0].meals[1].prices.pupils
                        + "<br>- Others: " +  meals[0].meals[1].prices.others  + "<br><br>" + meals[0].meals[2].name + "<br>" + "- Students: "
                        + meals[0].meals[2].prices.students + "<br>- Employees: " +  meals[0].meals[2].prices.employees + "<br>- Pupils: " +  meals[0].meals[2].prices.pupils
                        + "<br>- Others: " +  meals[0].meals[2].prices.others, {maxHeight: 200});

                      } else if(meals[0].meals.length == 2) {

                        marker.bindPopup("<b>" + data[i].name + "</b>" + "<br><br>" + meals[0].meals[0].name + ":<br>" + "- Students: "
                        + meals[0].meals[0].prices.students + "<br>- Employees: " +  meals[0].meals[0].prices.employees + "<br>- Pupils: " +  meals[0].meals[0].prices.pupils
                        + "<br>- Others: " +  meals[0].meals[0].prices.others + "<br><br>" + meals[0].meals[1].name + ":<br>" + "- Students: "
                        + meals[0].meals[1].prices.students + "<br>- Employees: " +  meals[0].meals[1].prices.employees + "<br>- Pupils: " +  meals[0].meals[1].prices.pupils
                        + "<br>- Others: " +  meals[0].meals[1].prices.others, {maxHeight: 200});

                      } else {

                        marker.bindPopup("<b>" + data[i].name + "</b>" + "<br><br>" + meals[0].meals[0].name + ":<br>" + "- Students: "
                        + meals[0].meals[0].prices.students + "<br>- Employees: " +  meals[0].meals[0].prices.employees + "<br>- Pupils: " +  meals[0].meals[0].prices.pupils
                        + "<br>- Others: " +  meals[0].meals[0].prices.others, {maxHeight: 200});

                      }

                    }
            });


          }


        },
        // error if no data sent from openmensa
        error: function(){

          alert("No data found!");

        }
});

/*
* function which gets the data of the institutes from the server
* creates an array with name of institutes
* source for jquery autocomplete
*/
$.ajax({
    type: 'GET',
    url: "./loadInstitute",

    success: function(result){
      console.log(result);
      console.log(result.institute[0].geojson.features[0].properties.name);

      // create an array with the names of the saved institutes
      var namearray = [];
      $.each(result.institute, function (i) {
                namearray.push(result.institute[i].geojson.features[0].properties.name);
            });

      console.log(namearray);

      // jquery autocomplete
      $( "#institute" ).autocomplete({
      source: namearray});
    }
});


// special icon for institute markers
var instituteIcon = L.icon({
    iconUrl: '/images/institute.png',
    iconSize: [40, 40]});


/*
* function which gets the data of the institutes from the server
* add institutes which were selected with jquery autocomplete to the map and show their faculties
*/
$('#institute').on('autocompleteselect', function (e, ui) {

  // to remove information of a faculty when another becomes be selected
  document.getElementById("faculty").innerHTML = "";

  $.ajax({
      type: 'GET',
      url: "./loadInstitute",
      success: function(result){

        // add the institute which was selected to the map
        $.each(result.institute, function (i) {

          // compare input (select bar) with the names in result
          if(document.getElementById('institute').value == result.institute[i].geojson.features[0].properties.name){

            var b = result.institute[i].geojson;
            console.log(b);
            L.geoJSON(b).addTo(map);
            var c = result.institute[i].geojson;
            console.log(c);
            console.log(c.features[0].properties.name);
            var d = c.features[0].geometry.coordinates[0][0];
            console.log(d);
            var lat = d[1];
            var lon = d[0];
            var marker = L.marker([lat, lon], {icon: instituteIcon}).addTo(map);
            var img = c.features[0].properties.img;
            var name = c.features[0].properties.name;
            console.log(img);
            // popup with name and image of the institute
            marker.bindPopup("<b>"+ name + "<b>:<br><img src='" + img + "'" + " class=popupImage " + "/>", {maxHeight: 250, maxWidth: "auto"});

            // load the data of the faculties
            $.ajax({
                type: 'GET',
                url: "./loadFaculty",
                success: function(response){

                  console.log(response);

                  // find the faculty, which has the name of the selected institute in its attribute institutes
                  $.each(response.faculty, function (j) {
;
                    var str = response.faculty[j].institutes;
                    var res = result.institute[i].geojson.features[0].properties.name;
                    console.log(str);
                    console.log(res);
                    var re = new RegExp(res, 'g');

                    if(str.match(re)){ // function to find string in a string

                      document.getElementById("faculty").innerHTML =
                        "<b>Belongs to faculty:</b>" + "<br><br> " +
                        response.faculty[j].name + "<br><br> " +
                        response.faculty[j].shortcut + "<br><br> " +
                        response.faculty[j].website + "<br><br> " +
                        response.faculty[j].institutes + "<br><br>";

                    } else {
                      j++;
                    }
              });
            }
        });
          } else {
            i++;
          }
        });
      }
    });
});
