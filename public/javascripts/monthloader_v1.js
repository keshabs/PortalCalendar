$(document).ready(function(){

  var monthevents = {};



  var weekdays = ["SUN","MON","TUE","WED","THU","FRI","SAT"];


  //var events = [];



  $.ajax( 'http://localhost:3000/events', {
    type: 'GET',
    dataType: 'json',
    data: { date: currentmonth, calendar: "monthly"},
    success: function( resp ) {

      if(resp.hasOwnProperty("error")){
        alert(resp.error);
      }else {

      events = resp;

      loadCalendar(currentyear,currentmonth);
    }
    },
    error: function( req, status, err ) {
      console.log( 'something went wrong - get request', status, err );
    }
  });



  var loadCalendar = function(year,month) {


    var html = "";
    var t = new Date(year,month,1);
    var startday = t.getDay();

    var lastmonthday = new Date(year,month,0).getDate()-startday+1;
    var nextmnth = 1;

    var d = 1;
    //console.log(t.toLocaleDateString());
    //monthevents = getEvents(t.toLocaleDateString());

    //if(events != null) monthevents = getEvents(t.toLocaleDateString());
    //console.log(monthevents);

  //  $("#cmonth").html(new Intl.DateTimeFormat('en-US',{month: 'long'}).format(t));
  //  $("#cyear").html(year);


    html += '<table class="monthtable"><thead class = "weekdays" ><tr>'
    for(var i = 0; i < 7; i++)
      html += '<th>'+weekdays[i]+'</th>';

    html += '</tr></thead><tbody class = "monthday">';


    for(var i = 0; i < 6; i++){
      html += '<tr>';
      for(var j = 0; j < 7; j++){

        if((i==0 && j<startday)||month != (t.getMonth())){
          if(i == 0)
            html += '<td class="faded">'+(lastmonthday++)+'</td>';
          else {
            html += '<td class="faded">'+(nextmnth++)+'</td>';
          }
        }else{
          var dateid = t.toISOString().slice(0,10);


          if(monthevents.hasOwnProperty(dateid) && monthevents[dateid].length > 0){
            html += '<td class = "event monthevent" data-date="'+dateid+'" id="e'+dateid+'" ><div>'+ t.getDate()+'</div>';
          }
          else
            html += '<td class = "monthevent" data-date="'+dateid+'" id="e'+dateid+'"><div>'+ t.getDate()+'</div>';
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
    $("#main").html(html);

    var drawer = document.querySelectorAll(".monthevent");


    var drawerClassList = document.querySelector(".sidedrawer").classList;

    drawer.forEach(function(el){
      el.addEventListener('click',function(e){
        loaddrawer(this.dataset.date);

        var date = this.dataset.date;

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

  loadCalendar(currentyear,currentmonth);


  function updateUrl(){
    var url = document.location.href;
    var n;
    if((n=url.indexOf("?date")) != -1){
      url = url.substr(0,n);
    }
    document.location = url+"?date="+currentyear+"-"+(currentmonth+1);

  }

  $(".btn-prev").click(function(){

    currentmonth--;
    if(currentmonth < 0){
      currentmonth = 11;
      currentyear--;
    }

    updateUrl();
  //  loadCalendar(currentyear,currentmonth);


  });

  $(".btn-nxt").click(function(){
    currentmonth++;
    if(currentmonth > 11){
      currentmonth = 0;
      currentyear++;
    }
    updateUrl();

  //  loadCalendar(currentyear,currentmonth);

  });

  function getEvents(mdate){
    var e = {};

    var d = new Date(mdate);
    var month = d.getMonth();

    var ev = events;

    for(var i = 0; i < ev.length; i++){

      var startdate = ev[i].StartDate.slice(0,10);

      if(startdate.substring(5,7) == month+1){
        if(e.hasOwnProperty(startdate))
          e[startdate].push(ev[i]);
        else{
          e[startdate] = [];
          e[startdate].push(ev[i]);
        }

      }

    }
    //console.log(e);
    return e;

  }

  function loaddrawer(date){
  //  var drawer = document.querySelector("#drawercontent");
    var html = "";

    html += '<h1 id="drawertitle">'+weekdays[(new Date(date).getDay()+1)%7]+' '+ date +'</h1>';

    if( !monthevents.hasOwnProperty(date) || monthevents[date].length < 1){
      html += '<p>No Events</p>';
    } else {
      var dateevents = monthevents[date];
      for(var i = 0; i < dateevents.length; i++){
          html += '<div><p>'+dateevents[i].Title+'<span class="deleteevent" data-id="'+dateevents[i]._id+'">\u00D7</span></p>';
    			html += '<p>'+dateevents[i].StartDate+'-'+dateevents[i].EndDate+'</p></div>';
      }
    }
    $("#drawercontent").html(html);
    var drawerdelete = document.querySelectorAll(".deleteevent");

    drawerdelete.forEach(function(el){
      el.addEventListener('click',function(e){
          deleteevent(date,this.dataset.id);
      });
    });
  }

  function deleteevent(date,id){


    $.ajax( 'http://localhost:3000/events/'+id, {
      type: 'DELETE',
      success: function( resp ) {

        if(resp.hasOwnProperty("error")){
          alert(resp.error);
        }else {

          var temp = monthevents[date];
          for(let i = 0; i < temp.length; i++){
            if(temp[i]._id === id){
              temp.splice(i,1);
              break;
            }
          }
          if(monthevents[date].length < 1)
            $("#e"+date).removeClass("event");
          loaddrawer(date);

          for(let i = 0; i < events.length; i++){
            if(events[i]._id === id){
              events.splice(i,1);
              break;
            }
          }
      }

      },
      error: function( req, status, err ) {
        console.log( 'something went wrong', status, err );
      }
    });

  }

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
    console.log(d);
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
          events.push(resp);
          var startdate = resp.StartDate.slice(0,10);
          if(monthevents.hasOwnProperty(startdate))
            monthevents[startdate].push(resp);
          else{
            monthevents[startdate] = [];
            monthevents[startdate].push(resp);
          }
          $("#e"+startdate).addClass("event");

          //console.log(monthevents);

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
