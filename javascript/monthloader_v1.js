$(document).ready(function(){

  var monthevents = {};

  var date = new Date();
  var currentday = date.getDate();
  var currentmonth = date.getMonth();
  var currentyear = date.getFullYear();

  var weekdays = ["SUN","MON","TUE","WED","THU","FRI","SAT"];


  var events = null;

  $.ajax( 'http://localhost:3000/events', {
    type: 'GET',
    dataType: 'json',
    success: function( resp ) {

      console.log(resp);

      events = resp;
      //console.log(events);
      loadCalendar(currentyear,currentmonth);
    },
    error: function( req, status, err ) {
      console.log( 'something went wrong', status, err );
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

    if(events != null) monthevents = getEvents(t.toLocaleDateString());
    //console.log(monthevents);

    $("#cmonth").html(new Intl.DateTimeFormat('en-US',{month: 'long'}).format(t));
    $("#cyear").html(year);

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
          var d = t.toLocaleDateString();
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

  $(".btn-prev-mnth").click(function(){
    console.log("here");
    currentmonth--;
    if(currentmonth < 0){
      currentmonth = 11;
      currentyear--;
    }

    loadCalendar(currentyear,currentmonth);
  });

  $(".btn-nxt-mnth").click(function(){
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

    var ev = events;

    for(var i = 0; i < ev.length; i++){

      if(ev[i].StartDate.substring(5,7) == month+1){
        if(e.hasOwnProperty(ev[i].StartDate))
          e[ev[i].StartDate].push(ev[i]);
        else{
          e[ev[i].StartDate] = [];
          e[ev[i].StartDate].push(ev[i]);
        }

      }

    }
    //console.log(e);
    return e;

  }

  function loaddrawer(date){
  //  var drawer = document.querySelector("#drawercontent");
    var html = "";

    html += '<h1 id="drawertitle">'+weekdays[new Date(date).getDay()+1]+' '+ date +'</h1>';

    if( !monthevents.hasOwnProperty(date) || monthevents[date].length < 1){
      html += '<p>No Events</p>';
    } else {
      var dateevents = monthevents[date];
      for(var i = 0; i < dateevents.length; i++){
          html += '<div><p>'+dateevents[i].Title+'<span class="deleteevent" data-id="'+dateevents[i]._id+'">\u00D7</span></p>';
    			html += '<p>'+dateevents[i].StartTime+'-'+dateevents[i].EndTime+'</p></div>';

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


    $.ajax( 'http://thiman.me:1337/keshab/'+id, {
      type: 'DELETE',
      success: function( resp ) {
        console.log( "deleted" );

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

  $("#createbutton").click(function(e){
    //console.log($("#event-form").serializeArray());
    var d = $("#event-form").serializeArray();

    $.ajax( 'http://localhost:3000/events', {
      type: 'POST',
      dataType: 'json',
      data: d,
      success: function( resp ) {
        console.log(resp);
        events.push(resp);
        if(monthevents.hasOwnProperty(resp.StartDate))
          monthevents[resp.StartDate].push(resp);
        else{
          monthevents[resp.StartDate] = [];
          monthevents[resp.StartDate].push(resp);
        }
        $("#e"+d[1]["value"]).addClass("event");
        //console.log(monthevents);
        document.getElementById("event-form").reset();
      },
      error: function( req, status, err ) {
        console.log( 'something went wrong', status, err );
      }
    });

    hideForm();

  });






});
