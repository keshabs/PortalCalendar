
var d = new Date();

var weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];


var calendarbody = document.querySelector("#main");

var loadCalendar = function(date){
  var d = date.getDate();
  var month = date.getMonth();
  var year = date.getFullYear();
  var day = date.getDay();

  document.querySelector("#daytitle").innerHTML = weekdays[day] + " " + (month+1) + "/" + d;

}

loadCalendar(d);

var prevday = document.querySelector("#prevday");
var nextday = document.querySelector("#nextday");

prevday.addEventListener('click',function(e){
  d.setDate(d.getDate()-1);
  loadCalendar(d);
});
nextday.addEventListener('click',function(e){
  d.setDate(d.getDate()+1);
  loadCalendar(d);
});
