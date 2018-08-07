"use strict";

/**
*@desc: ajax function that loads the data from the subjects areas into /subject
*/
function loadFaculties(){

  console.log("ich mache was");
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("demo").innerHTML =
      this.responseText;
    }
  };
  xhttp.open("GET", "/get-data", true); //get data on /get-data
  xhttp.send();

}

/**
*@desc: ajax function that loads the data from the subjects areas into /subject
*/
function loadInstitutes(){

  console.log("ich mache was");
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("demo2").innerHTML =
      this.responseText;
    }
  };
  xhttp.open("GET", "/get-datatwo", true); //get data on /get-data
  xhttp.send();

}
