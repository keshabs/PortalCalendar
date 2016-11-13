var table = document.getElementById("calendar");
var row = null;

var d = 1;
for(var i = 1; i < 5; i++){
  row = table.insertRow(i);
  var cell = null;
  for(var j = 0; j < 7; j++){
    cell = row.insertCell(j);
    //console.log(d);

    cell.innerHTML += '<p class="day">'+ d++ + '</p>';


  }
}
