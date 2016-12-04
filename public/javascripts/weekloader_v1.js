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

      console.log(resp);

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

      console.log(s.getHours());
      console.log(e.getHours());

      var id = 'd'+(s.getMonth()+1)+'-'+s.getDate()+'-';
      for(var j = 0; j <= e.getHours()-s.getHours(); j++){
        var did = id+(s.getHours()+j);
        console.log(did);
        if(j == 0){
            $("#"+did).html(events[i].Title);
        }
        $("#"+did).addClass("event");


        }
      }
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
});
