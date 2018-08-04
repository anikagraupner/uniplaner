"use strict";

/**
*@desc: ajax function that loads the data from the subjects areas into /subject
*/
function loadSubjectAreas(){

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
