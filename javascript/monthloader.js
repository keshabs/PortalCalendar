var date = new Date();
var currentday = date.getDate();
var currentmonth = date.getMonth();
var currentyear = date.getFullYear();

var weekdays = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
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
  //console.log(t.toLocaleDateString());
  var monthevents = getEvents(t.toLocaleDateString());
  console.log(monthevents);


  document.querySelector("#prevmonth").innerHTML = month == 0 ? months[11] : months[(month-1)%12];
  document.querySelector("#cmonth").innerHTML = months[month];
  document.querySelector("#nextmonth").innerHTML = months[(month+1)%12];
  document.querySelector("#cyear").innerHTML = year;

  html += '<table class="monthtable"><thead class = "weekdays" ><tr>'
  for(var i = 0; i < 7; i++)
    html += '<th>'+weekdays[i]+'</th>';

  html += '</tr></thead><tbody class = "monthday">';


  for(var i = 0; i < 6; i++){
    html += '<tr>';
    for(var j = 0; j < 7; j++){

      if((i==0 && j<startday)||month != (t.getMonth())){
        html += '<td></td>';
      }else{
        var d = t.toLocaleDateString();

        if(monthevents.hasOwnProperty(d) && monthevents[d].length > 0){
          html += '<td class = "event monthevent" data-date="'+d+'"><div>'+ t.getDate()+'</div>';
        }
        else
          html += '<td class = "monthevent" data-date="'+d+'"><div>'+ t.getDate()+'</div>';
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
      //console.log(this.dataset.date);
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




function getEvents(mdate){
  var e = {};
  var d = new Date(mdate);
  var month = d.getMonth();

  var key;


  while(month === d.getMonth()){
    var dayEvents = [];
    key = d.toLocaleDateString();
    if(events.hasOwnProperty(key)){
      dayEvents = events[key];
    }
    e[key] = dayEvents;
    d.setDate(d.getDate()+1);

  }
  var repeats = [];
  if(events.hasOwnProperty("repeats")){
    repeats = events["repeats"];
  }
  //console.log(repeats);
  var r = [];
  for(var i = 0; i < repeats.length; i++){
    r = repeats[i].split("-");

    var eventid = null;

    var x = new Date(mdate);
    var y = new Date(r[0]);
    var z = new Date(r[1]);

    var dayevents = [];
    if(x >= y && x <= z ){
      dayevents = events[r[0]];
    }
    for(var j = 0; j < dayevents.length; j++){
      if(dayevents[j].id == r[2]){
        eventid = dayevents[j];
        break;
      }
    }

    if(eventid && eventid.repeat === "weekly"){
      var firstday = y.getDay();
      var week = 0;
      var repdate = y;

      while(repdate<=z){
        for(var j = 0; j < eventid.weekrep.length; j++){
            var shift = eventid.weekrep[j]-firstday;
            repdate = new Date(r[0]);
            repdate.setDate(repdate.getDate()+shift);
            repdate.setDate(repdate.getDate()+7*week);

            if(repdate<=z){
              if(repdate.getMonth()===month){
                eventid.parent = y.toLocaleDateString();
                e[repdate.toLocaleDateString()].push(eventid);

              }
            }
        }
        week++;
      }
    } else if (eventid && eventid.repeat === "monthly"){
      var repdate = new Date(r[0]);
      while(repdate <= z){

        if(repdate<=z){
          if(repdate.getMonth()===month){
            eventid.parent = y.toLocaleDateString();
            e[repdate.toLocaleDateString()].push(eventid);
          }
        }
        repdate.setMonth(repdate.getMonth()+1);
      }
    }

  }


  return e;
}
