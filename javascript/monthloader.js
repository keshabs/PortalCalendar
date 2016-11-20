var date = new Date();
var currentday = date.getDate();
var currentmonth = date.getMonth();
var currentyear = date.getFullYear();

var weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var daysinmonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var calendarbody = document.querySelector("#main");

events = {};
if(localStorage.getItem("events") != null){
  events = JSON.parse(localStorage.getItem("events"));
}
console.log(events);

var loadCalendar = function(year,month) {
  calendarbody.innerHTML = "";
  var html = "";
  var t = new Date(year,month,1);
  var startday = t.getDay();

  var d = 1;




  document.querySelector("#prevmonth").innerHTML = month == 0 ? months[11] : months[(month-1)%12];
  document.querySelector("#cmonth").innerHTML = months[month];
  document.querySelector("#nextmonth").innerHTML = months[(month+1)%12];
  document.querySelector("#cyear").innerHTML = year;

  html += '<table class="monthtable"><thead class = "weekdays" ><tr>'
  for(var i = 0; i < 7; i++)
    html += '<th>'+weekdays[i]+'</th>';

  html += '</tr></thead><tbody class = "monthday">';


  for(var i = 0; i < 5; i++){
    html += '<tr>';
    for(var j = 0; j < 7; j++){

      if((i==0 && j<startday)||month != (t.getMonth())){
        html += '<td></td>';
      }else{
        var a = t.getDate() < 10 ? "0"+t.getDate() : t.getDate();
        var d = t.getFullYear()+"-"+(t.getMonth()+1)+"-"+ a;
        html += '<td><p data-date="'+d+'">'+ t.getDate() +'</p>';

        if(events.hasOwnProperty(d))
          html += '<button type="button" class="monthevent"></button>';
        html += '</td>';
        t.setDate(t.getDate()+1);
      }

    }
    html += '</tr>';
    if(month != (t.getMonth())){
      break;
    }

  }

  html += '</tbody></table>';
  calendarbody.innerHTML += html;
  var drawer = document.querySelectorAll(".monthevent");
  var drawerclsbtn = document.querySelector("#closedrawer");

  var drawerClassList = document.querySelector(".sidedrawer").classList;

  drawer.forEach(function(el){
    el.addEventListener('click',function(e){
      drawerClassList.remove("hide");
      setTimeout(function(){drawerClassList.remove("slide");},10);

    });

  });


  drawerclsbtn.addEventListener('click',function(e){

    drawerClassList.add("slide");
    setTimeout(function(){drawerClassList.add("hide");},500);


  });


}
loadCalendar(currentyear,currentmonth);
var prevmnth = document.querySelector("#prevmonth");
var nextmnth = document.querySelector("#nextmonth");

prevmnth.addEventListener('click',function(e){
  currentmonth--;
  if(currentmonth < 0){
    currentmonth = 11;
    currentyear--;
  }

  loadCalendar(currentyear,currentmonth);
});
nextmnth.addEventListener('click',function(e){
  currentmonth++;
  if(currentmonth > 11){
    currentmonth = 0;
    currentyear++;
  }
  loadCalendar(currentyear,currentmonth);
});
