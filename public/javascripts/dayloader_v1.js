$(document).ready(function(){


  var dayevents = {};



  console.log(cdate);
  $.ajax( 'http://localhost:3000/events', {
    type: 'GET',
    dataType: 'json',
    data: { date: cdate.toISOString(),calendar: "daily"},
    success: function( resp ) {

      if(resp.hasOwnProperty("error")){
        alert(resp.error);
      }else {

      //console.log(resp);

      dayevents = getEvents(resp);
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


      for(var j = 0; j < e.getHours()-s.getHours(); j++){
        var did = 'd'+(s.getHours()+j);
        if(j == 0){
            $("#"+did).html(events[i].Title+':'+events[i].Description);
        }
        $("#"+did).addClass("event");


        }
      }
  }

  var loadCalendar = function(d){

    var date = new Date(d);

    var html = "";
    html += '<table class="daytable"><thead ><tr><th class="timecol">Time</th>';

    html += '<th>Event</th></tr></thead><tbody>';

    var time = 11;
    for(var i = 0; i < 24; i++){
      html += '<tr>';
      for(var j = 0; j < 2; j++){
        if(j == 0){
          var timeCol = time < 23 ? ((time%12)+1) +":00 AM" : ((time%12)+1) +":00 PM";
          time++;
          html += '<td>'+timeCol+'</td>';
        }else{
          var id = (time-12);
          html += '<td id="d'+id+'"></td>';        }
      }
      html += '</tr>';
    }
    html += '</tbody></table>';

    $("#main").html(html);

  }

  loadCalendar(cdate);

  function updateUrl(weekDate){
    var url = document.location.href;

    var n;
    if((n=url.indexOf("?date")) != -1){
      url = url.substr(0,n);
    }
    document.location = url+"?date="+weekDate;

  }

  $(".btn-prev").click(function(){
    cdate.setDate(cdate.getDate()-1);
    updateUrl(cdate.toLocaleDateString());
  });

  $(".btn-nxt").click(function(){
    cdate.setDate(cdate.getDate()+1);
    updateUrl(cdate.toLocaleDateString());
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
  })
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
          if(dayevents.hasOwnProperty(startdate))
            dayevents[startdate].push(resp);
          else{
            dayevents[startdate] = [];
            dayevents[startdate].push(resp);
          }
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
