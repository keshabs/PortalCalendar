
//localStorage.clear();


var events = {};

function newevent(t,d,tm,ds){
  this.title = t;
  this.date = d;
  this.time = tm;
  this.description = ds;
}


if(localStorage.getItem("events") != null){
  events = JSON.parse(localStorage.getItem("events"));
}



var btn = document.querySelector("#add-btn");
var clsbtn = document.querySelector("#close-btn");
var outsideform = document.querySelector("#main");
var createEventBtn = document.querySelector("#createbutton");
var eventform = document.querySelector(".eventform").classList;

var eventtitle = document.querySelector("#eventtitle");
var eventtime = document.querySelector("#eventtime");
var eventdate = document.querySelector("#eventdate");
var eventdescription = document.querySelector("#eventdescription");


btn.addEventListener('click',function(e){
  eventform.remove("hide");
  outsideform.classList.add("dark");

});

function hidedrawer(){
    eventform.add("hide");
    outsideform.classList.remove("dark");

};

clsbtn.addEventListener('click',hidedrawer);


outsideform.addEventListener('click',hidedrawer);

createEventBtn.addEventListener('click',function(e){
  //console.log(eventtitle.value + " " + eventdate.value + " " + eventtime.value + " " + eventdescription.value);
  var e = new newevent(eventtitle.value,eventdate.value,eventtime.value,eventdescription.value);
  var event = [];
  var ev = eventdate.value;
  if(events.hasOwnProperty(ev)){
    event = events[ev];
  }
  event.push(e);
  //console.log(event);
  events[ev] = event;

  localStorage.setItem("events",JSON.stringify(events));

  hidedrawer();
  location.reload();


});
