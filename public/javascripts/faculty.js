"use strict";

/**
* function to save a new faculty in the database (collection: faculties)
*/
function saveFaculty(){

  // get the input values from the site (faculty.jade)
  var name = document.getElementById('name').value;
  var shortcut = document.getElementById('shortcut').value;
  var website = document.getElementById('website').value;
  var institutes = document.getElementById('institutes').value;

  // create json form the input values
  var newFaculty = {"name":name, "shortcut":shortcut, "website":website, "institutes":institutes};
  console.log(newFaculty);

  // no saving without a name
  if(newFaculty.name == ""){

    JL("mylogger").error("Data was not send to database.");
    alert("Error: Please enter a name!")

  // send new faculty to the server
  } else {

    var data = JSON.stringify(newFaculty);
    console.log(data);
    JL("mylogger").info("Data was sent to database.");
    alert("New faculty was sucessfully saved!");

    $.ajax({
      type: 'POST',
      data: data,
      dataType: "json",
      contentType: 'application/json',
      url: "./insertFaculty",

    });

  }

}

/*
* function which gets the data of the faculties from the server
* creates an array with name and shortcut of faculties
* results for jquery autocomplete
*/
$.ajax({
    type: 'GET',
    url: "./loadFaculty",

    success: function(result){

      JL("mylogger").info("Data was sent to client side.");
      console.log(result);

      var faArray = [];
      $.each(result.faculty, function (i) {
                faArray.push(result.faculty[i].name);
                faArray.push(result.faculty[i].shortcut);
            });

      console.log(faArray);
      $( "#searchfaculty" ).autocomplete({
      source: faArray});

    }

});

/*
* function which gets the data of the faculties from the server
* load the values to the input fields on 'faculty.jade'
*/
$('#searchfaculty').on('autocompleteselect', function (e, ui) {

  $.ajax({
      type: 'GET',
      url: "./loadFaculty",
      success: function(response){

        console.log(response);

        // document must load first, important to run the function correctly
        $(document).ready(function() {

          $.each(response.faculty, function (i) {

            // searching for name or shortcut
            if(document.getElementById('searchfaculty').value == response.faculty[i].name || document.getElementById('searchfaculty').value == response.faculty[i].shortcut){

              console.log("hallo");

              document.getElementById('idup').value = response.faculty[i]._id;
              document.getElementById('nameup').value = response.faculty[i].name;
              document.getElementById('shortcutup').value = response.faculty[i].shortcut;
              document.getElementById('websiteup').value = response.faculty[i].website;
              document.getElementById('institutesup').value = response.faculty[i].institutes;

            } else {

              i++;

            }


          });

        });

      }

    });

});
