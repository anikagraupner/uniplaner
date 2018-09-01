/* code for faculty.jade */

"use strict";

// Debugging: all loggers log to both the server and the console
// See: https://github.com/Effizjens/Aufgabe_7/blob/master/public/javascripts/map.js
var ajaxAppender=JL.createAjaxAppender('ajaxAppender');
var consoleAppender=JL.createConsoleAppender('consoleAppender');
JL("mylogger").setOptions({"appenders": [ajaxAppender,consoleAppender]});

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

    JL("mylogger").error("Data of the faculty was not send to database.");
    alert("Error: Please enter a name!")

  // send new faculty to the server
  } else {

    var data = JSON.stringify(newFaculty);
    console.log(data);
    JL("mylogger").info("Data of the faculty was sent to database.");
    alert("New faculty was sucessfully saved!");

    // dataType and contentType important for right sending of the json
    $.ajax({
      type: 'POST',
      data: data,
      dataType: "json",
      contentType: 'application/json',
      url: "./insertFaculty",
    });
    // setTimeout, because direct reloading causes the new faculty to not yet be displayed in the search field
    setTimeout(function(){ location.reload(true); }, 1000);
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

      JL("mylogger").info("Data of the faculty was sent to client side.");
      console.log(result);

      // create an array with the names and the shortcuts of the objects as the source for jquery autocomplete
      var faArray = [];
      $.each(result.faculty, function (i) {
                faArray.push(result.faculty[i].name);
                faArray.push(result.faculty[i].shortcut);
            });

      console.log(faArray);

      // jquery autocomplete
      $( "#searchfaculty" ).autocomplete({
      source: faArray});
    },
      // error by loading faculty data
      error: function(){
        JL("mylogger").error("Faculty data could not be loaded from the database!");
        alert("No data of faculties was sent from the server!");
      }
});

/*
* function which gets the data of the faculties from the server
* load the values to the input fields on 'faculty.jade'
* when the name or the shortcut of a faculty is selected with jquery autocomplete
*/
$('#searchfaculty').on('autocompleteselect', function (e, ui) {

  $.ajax({
      type: 'GET',
      url: "./loadFaculty",
      success: function(response){

        JL("mylogger").info("Data of the faculty was sent to client side.");

        console.log(response);

        // document must load first, important to run the function correctly
        $(document).ready(function() {

          $.each(response.faculty, function (i) {

            // searching for name or shortcut and compare them with the input of the jquery autocomplete search bar
            if(document.getElementById('searchfaculty').value == response.faculty[i].name || document.getElementById('searchfaculty').value == response.faculty[i].shortcut){

              // if name or shortcut are the same as the input, the data of the faculty is filled in the input fields
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
      },
        // error by loading faculty data
        error: function(){
          JL("mylogger").error("Faculty data could not be loaded from the database!");
          alert("No data of faculties was sent from the server!");
        }
    });
});


/**
* function to update a faculty in the database (collection: faculties)
*/
function updateFaculty(){

  // get the input values from the site (faculty.jade)
  var id = document.getElementById('idup').value;
  var name = document.getElementById('nameup').value;
  var shortcut = document.getElementById('shortcutup').value;
  var website = document.getElementById('websiteup').value;
  var institutes = document.getElementById('institutesup').value;

  // create json form the input values
  var upFaculty = {"id":id, "name":name, "shortcut":shortcut, "website":website, "institutes":institutes};
  console.log(upFaculty);

  // id is needed to change the data, the faculty must be selected with the search bar
  if(upFaculty.id == ""){

    JL("mylogger").error("No data to sent to the database.");
    alert("Error: Please select a dataset with the search function!")

  }
  // no saving without a name
  else if(upFaculty.name == ""){

    JL("mylogger").error("Changed data of the faculty was not sent to database.");
    alert("Error: Please enter a name!")

  // send changed data of the faculty to the server
  } else {

    var data = JSON.stringify(upFaculty);
    console.log(data);
    JL("mylogger").info("Changed data of the faculty was sent to database.");
    alert("The changes were taken over in the database!");

    // dataType and contentType important for right sending of the json
    $.ajax({
      type: 'POST',
      data: data,
      dataType: "json",
      contentType: 'application/json',
      url: "./updateFaculty",

    });
    setTimeout(function(){ location.reload(true); }, 1000);
  }
}

/*
* function to delete a faculty (only id is needed)
*/
function deleteFaculty(){

  // security question before deleting the dataset
  var txt;
  var r = confirm("Are you sure you want to delete the selected faculty?");
  if (r == false) {
      alert("Faculty was NOT deleted!")
  } else {

      var id = document.getElementById('idup').value;
      var delFaculty = {"id":id}

      // id is needed to delete the dataset
      if(delFaculty.id == ""){

        JL("mylogger").error("No data to send to the database.");
        alert("Error: Please select a dataset with the search function!")

      // send the id of the selected faculty to the server
      } else {

        var data = JSON.stringify(delFaculty);
        console.log(data);
        JL("mylogger").info("Data of the faculty was sent to server to delete the dataset.");
        alert("The selected faculty was deleted!");

        // dataType and contentType important for right sending of the json
        $.ajax({
          type: 'POST',
          data: data,
          dataType: "json",
          contentType: 'application/json',
          url: "./deleteFaculty",

        });
        // setTimeout, because direct reloading causes the old faculty to yet be displayed in the search field
        setTimeout(function(){ location.reload(true); }, 1000);
      }
    }
}
