$(document).ready(function(){
  var weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  var d = new Date();

  var loadCalendar = function(date){
    var weektitle =  (date.getMonth()+1) + '/' + date.getDate()+"-";

    var html = "";
    html += '<table class="weektable"><thead class = "weekdays" ><tr><th>Time</th>';

    for(var i = 0; i < 7; i++){
      html += '<th>'+ weekdays[i] + '<br>' + (date.getMonth()+1) + '/' + date.getDate() + '</th>';
      date.setDate(date.getDate()+1);
    }
    html += '</tr></thead>';

    date.setDate(date.getDate()-1);
    weektitle += (date.getMonth()+1) + '/' + date.getDate();
    date.setDate(date.getDate()+1);

    html += '</table>';

    $("#main").html(html);



  }
  d.setDate(d.getDate()-d.getDay());
  loadCalendar(d);

  $("#btn-prev").click(function(){
    d.setDate(d.getDate()-14);
    loadCalendar(d);
  });

  $("#btn-next").click(function(){
    d.setDate(d.getDate());
    loadCalendar(d);
  });
});
