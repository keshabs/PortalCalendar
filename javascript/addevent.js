
//localStorage.clear();


var events = {};


const colors = ["#B6B6B4","#98AFC7","#3090C7","#659EC7","#82CAFA","#AFDCEC","#4E8975","#F5F5DC","#F3E5AB","#966F33","#966F33","#E56E94"];



if(localStorage.getItem("events") != null){
  events = JSON.parse(localStorage.getItem("events"));
}



var btn = document.querySelector("#add-btn");
var clsbtn = document.querySelector("#close-btn");
var outsideform = document.querySelector("#main");
var createEventBtn = document.querySelector("#createbutton");
var eventform = document.querySelector(".eventform").classList;

var title = document.querySelector("#eventtitle");
var starttime = document.querySelector("#eventstarttime");
var endtime = document.querySelector("#eventendtime");
var date = document.querySelector("#eventdate");
var description = document.querySelector("#eventdescription");
var repeatbtn = document.querySelectorAll('input[type=radio][name="repeat"]');
var enddate = document.querySelector("#eventenddate");

var weekcheckbox = document.querySelector(".weeklycheckbox");
var edate = document.querySelector(".repetitiondate");

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



  var repeat = document.querySelector('input[name="repeat"]:checked').value;
  repeat = repeat.trim();
  var weekrepeat = [];
  var checkedValue = document.querySelectorAll('.weekrepeat');
  for(var i = 0; checkedValue[i]; i++){
    if(checkedValue[i].checked){
      weekrepeat.push(i);
    }
  }


  var ed = new Date(eventdate.value);
  ed.setDate(ed.getDate()+1);
  var ev = ed.toLocaleDateString();

  ed = new Date(enddate.value);
  ed.setDate(ed.getDate()+1);
  var end = ed.toLocaleDateString();


  if(title.value === "" || starttime.value === "" || endtime.value === "" || ev === "Invalid Date" || (repeat !== "none" && end === "Invalid Date")){
    console.log("invalid");
  }
  else {


      if(!events.hasOwnProperty("ids")){
        events["ids"]=1;
      }
      var id = events["ids"]++;
      var e = new newevent(id,title.value,ev,starttime.value,endtime.value,repeat,weekrepeat,
        end,description.value,colors[Math.floor((Math.random()*12)+1)]);

      console.log(e);
      var event = [];

      if(events.hasOwnProperty(ev)){
        event = events[ev];
      }
      event.push(e);
      //console.log(event);
      events[ev] = event;

      if(repeat !== "none"){
        var repeats = ev+"-"+end+"-"+id;
        if(!events.hasOwnProperty("repeats")){
          events["repeats"] = [];
        }
        events["repeats"].push(repeats);


      }

      localStorage.setItem("events",JSON.stringify(events));

      hidedrawer();
      //location.reload();
    }

});


function changeHandler(){
  if(this.value === 'none'){
    weekcheckbox.classList.add("hide");
    edate.classList.add("hide");
    edate.required = false;
  }
  else if(this.value === 'weekly'){
    weekcheckbox.classList.remove("hide");
    edate.classList.remove("hide");
    edate.required = true;

  } else if (this.value === 'monthly'){
    weekcheckbox.classList.add("hide");
    edate.classList.remove("hide");
    edate.required = true;

  }
}
Array.prototype.forEach.call(repeatbtn,function(radio){
  radio.addEventListener('change',changeHandler);
})
