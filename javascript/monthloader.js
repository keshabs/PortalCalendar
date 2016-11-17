var date = new Date();
var currentday = date.getDate();
var currentmonth = date.getMonth();
var currentyear = date.getFullYear();

var weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var daysinmonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var calendarbody = document.querySelector("#main");

var loadCalendar = function(year,month){
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
      if((i==0 && j<startday)||d>daysinmonth[month]){
        html += '<td></td>';
      }else{
        html += '<td><p>'+ d++ +'</p>';
        if(d-1 == 1){
          html += '<button type="button" class="monthevent"></button>';
        }
        html += '</td>';
      }
    }
    html += '</tr>';
    if(d>daysinmonth[month]){
      break;
    }

  }
  html += '</tbody></table>';
  calendarbody.innerHTML += html;
  
  var drawer = document.querySelector(".monthevent");
  var drawerclsbtn = document.querySelector("#closedrawer");

  var drawerClassList = document.querySelector(".sidedrawer").classList;

  drawer.addEventListener('click',function(e){
    console.log(e);

    drawerClassList.remove("hide");
    setTimeout(function(){drawerClassList.remove("slide");},10);

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
  console.log(currentyear+" "+currentmonth);
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
