
var d = new Date();

var weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

var calendarbody = document.querySelector("#main");

var loadCalendar = function(date){



  var weektitle =  (date.getMonth()+1) + '/' + date.getDate()+"-";

  var html = "";
  html += '<tr><th>Time</th>';

  for(var i = 0; i < 7; i++){
    html += '<th>'+ weekdays[i] + '<br>' + (date.getMonth()+1) + '/' + date.getDate() + '</th>';
    date.setDate(date.getDate()+1);
  }

  date.setDate(date.getDate()-1);
  weektitle += (date.getMonth()+1) + '/' + date.getDate();
  date.setDate(date.getDate()+1);
  document.querySelector("#weektitle").innerHTML = weektitle;
  document.querySelector(".weekdays").innerHTML = html;


}
d.setDate(d.getDate()-d.getDay());
loadCalendar(d);

var prevweek = document.querySelector("#prevweek");
var nextweek = document.querySelector("#nextweek");

prevweek.addEventListener('click',function(e){

  d.setDate(d.getDate()-14);
  loadCalendar(d);
});
nextweek.addEventListener('click',function(e){

  d.setDate(d.getDate());
  loadCalendar(d);
});
