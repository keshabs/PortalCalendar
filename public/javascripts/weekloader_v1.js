$(document).ready(function(){
  var weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  var weekevents = {};


  $.ajax( 'http://localhost:3000/events', {
    type: 'GET',
    dataType: 'json',
    data: { startweek: startWeek.toISOString(), endweek: endWeek.toISOString(), calendar: "weekly"},
    success: function( resp ) {

      if(resp.hasOwnProperty("error")){
        alert(resp.error);
      }else {

      //console.log(resp);

      weekevents = getEvents(resp);
      loadEvents(resp);

    }
    },
    error: function( req, status, err ) {
      console.log( 'something went wrong - get request', status, err );
    }
  });

  function getEvents(events){
    var e = {};


    var ev = events;

    for(var i = 0; i < ev.length; i++){

      var startdate = ev[i].StartDate.slice(0,10);


        if(e.hasOwnProperty(startdate))
          e[startdate].push(ev[i]);
        else{
          e[startdate] = [];
          e[startdate].push(ev[i]);
        }



    }
    //console.log(e);
    return e;
  }
  function loadEvents(events){

    for(var i = 0; i < events.length; i++){
      var s = new Date(events[i].StartDate);
      var e = new Date(events[i].EndDate);

      //console.log(s.getHours());
      //console.log(e.getHours());

      var id = 'd'+(s.getMonth()+1)+'-'+s.getDate()+'-';
      var data = null;
      for(var j = 0; j < e.getHours()-s.getHours(); j++){
        var did = id+(s.getHours()+j);
        var cell = $("#"+did);
        if(j == 0){
            cell.html(events[i].Title);
            data = s.toISOString().slice(0,10);
        }
       cell.addClass("event");
       cell.attr("data-date",data);


        }
      }


      var drawer = document.querySelectorAll(".event");
      var drawerClassList = document.querySelector(".sidedrawer").classList;

      drawer.forEach(function(el){
        el.addEventListener('click',function(e){
          loaddrawer(this.dataset.date);

          drawerClassList.remove("hide");
          setTimeout(function(){drawerClassList.remove("slide");},10);

        });

      });

      var drawerclsbtn = document.querySelector("#drawer-cls-btn");
      drawerclsbtn.addEventListener('click',function(e){

          drawerClassList.add("slide");
          setTimeout(function(){drawerClassList.add("hide");},500);


        });
  }

  var loadCalendar = function(d){

    var date = new Date(d);

    var html = "";
    html += '<table class="weektable"><thead class = "weekdays" ><tr><th>Time</th>';

    var dates = [];
    for(var i = 0; i < 7; i++){
      var dateCol = (date.getMonth()+1) + '-' + date.getDate();
      dates.push(dateCol);
      html += '<th>'+ weekdays[i] + '<br>' + dateCol + '</th>';
      date.setDate(date.getDate()+1);
    }
    html += '</tr></thead><tbody>';

    var time = 11;
    for(var i = 0; i < 24; i++){
      html += '<tr>';
      for(var j = 0; j < 8; j++){
        if(j == 0){
          var timeCol = time < 23 ? ((time%12)+1) +":00 AM" : ((time%12)+1) +":00 PM";
          time++;
          html += '<td>'+timeCol+'</td>';
        }else{
          var id = dates[j-1]+'-'+(time-12);
          html += '<td id="d'+id+'"></td>';
          //html += '<td class="test"></td>';
        }
      }
      html += '</tr>';
    }
    html += '</tbody></table>';

    $("#main").html(html);

  }

  loadCalendar(startWeek);

  function updateUrl(weekDate){
    var url = document.location.href;

    var n;
    if((n=url.indexOf("?date")) != -1){
      url = url.substr(0,n);
    }
    document.location = url+"?date="+weekDate;

  }

  $(".btn-prev").click(function(){
    startWeek.setDate(startWeek.getDate()-1);
    updateUrl(startWeek.toLocaleDateString());
  });

  $(".btn-nxt").click(function(){
    endWeek.setDate(endWeek.getDate()+1);
    updateUrl(endWeek.toLocaleDateString());
  });

  var eventform = $(".eventform");
  var outsideform = $("#main");

  $("#add-btn").click(function(){
    eventform.removeClass("hide");
    outsideform.addClass("dark");
  });
  outsideform.click(function(){
    hideForm();
  });
  $("#close-btn").click(function(){
    hideForm();
  });
  function loaddrawer(date){
  //  var drawer = document.querySelector("#drawercontent");
    var html = "";

    html += '<h1 id="drawertitle">'+weekdays[(new Date(date).getDay()+1)%7]+' '+ date +'</h1>';

    if( !weekevents.hasOwnProperty(date) || weekevents[date].length < 1){
      html += '<p>No Events</p>';
    } else {
      var dateevents = weekevents[date];
      for(var i = 0; i < dateevents.length; i++){
          html += '<div><p>'+dateevents[i].Title+'<span class="deleteevent" data-id="'+dateevents[i]._id+'">\u00D7</span></p>';
          var s = new Date(dateevents[i].StartDate);
          var e = new Date(dateevents[i].EndDate);
    			html += '<p>'+s.getHours()+':'+s.getMinutes()+'-'+e.getHours()+':'+e.getMinutes()+'</p></div>';
      }
    }
    $("#drawercontent").html(html);
    var drawerdelete = document.querySelectorAll(".deleteevent");

    drawerdelete.forEach(function(el){
      el.addEventListener('click',function(e){
          //deleteevent(date,this.dataset.id);
      });
    });
  }




  function hideForm(){
    eventform.addClass("hide");
    outsideform.removeClass("dark");
  }

  function getDate(date,time){
    var year = date.substr(0,4);
    var month = date.substr(5,2);
    var day = date.substr(8,2);
    var hour = time.substr(0,2);
    var minute = time.substr(3,2);


    var d = new Date(year,(month-1)%12,day,hour,minute);
    //console.log(d);
    return d;
  }





  $("#createbutton").click(function(e){
    //console.log($("#event-form").serializeArray());
    var d = $("#event-form").serializeArray();
    var startDate = getDate(d[1].value,d[2].value);
    var endDate = getDate(d[1].value,d[3].value);
    var e = {
      Title: d[0].value,
      StartDate: startDate,
      EndDate: endDate,
      Repeat: d[4].value,
      Description: d[5].value
    }

    $.ajax( 'http://localhost:3000/events', {
      type: 'POST',
      dataType: 'json',
      data: e,
      success: function( resp ) {
        if(resp.hasOwnProperty("error")){
          alert(resp.error);
        }else {
          var startdate = resp.StartDate.slice(0,10);
          if(weekevents.hasOwnProperty(startdate))
            weekevents[startdate].push(resp);
          else{
            weekevents[startdate] = [];
            weekevents[startdate].push(resp);
          }
          console.log(resp);
          var newevent = [];
          newevent.push(resp);
          loadEvents(newevent);


      }
      },
      error: function( req, status, err ) {
        console.log( 'something went wrong', status, err );
      }
    });

    document.getElementById("event-form").reset();
    hideForm();

  });




});
