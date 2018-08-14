"use strict";

// creating map by using mapbox
L.mapbox.accessToken = 'pk.eyJ1IjoiYW5pa2FnIiwiYSI6ImNqaWszMHZkYTAxcnYzcXN6OWl3NW5vdHkifQ.LeZkk6ZXp8VN1_PuToqTVA';
  var map = L.mapbox.map('routmap').setView([51.95, 7.61], 11);

// adding different layers to the map
L.control.layers({

  'Mapbox Streets': L.mapbox.tileLayer('mapbox.streets-basic').addTo(map),
  'Mapbox Satellite': L.mapbox.tileLayer('mapbox.satellite'),
  'Mapbox Dark': L.mapbox.tileLayer('mapbox.dark'),
  'Mapbox Light': L.mapbox.tileLayer('mapbox.light')

}).addTo(map);


var canteenIcon = L.icon({
    iconUrl: '/images/canteen_icon.jpg',
    iconSize: [40, 40]});

$.ajax({
        type: "GET",
        url: "http://openmensa.org/api/v2/canteens/?near[lat]=51.954522&near[lng]=7.614505&near[dist]=15",
        success: function(data){
        console.log(data);

          for(var i = 0; i<=11; i++){

            var lat = data[i].coordinates[0];
            console.log(lat);
            var lon = data[i].coordinates[1];
            console.log(lon);
            var marker = L.marker([lat, lon], {icon: canteenIcon}).addTo(map);
            var id = data[i].id;
            var url = "http://openmensa.org/api/v2/canteens/"+id+"/meals";
            $.ajax({
                    type: "GET",
                    url: url,
                    async: false,
                    success: function(meals){



                      if(meals == ""){

                        marker.bindPopup("<b>" + data[i].name + "</b>" + ":" + "<br>Closed today!");

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
        error: function(){

          alert("No data found!");

        }
});
