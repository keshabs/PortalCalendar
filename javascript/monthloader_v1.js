$(document).ready(function(){


  //
  // $.ajax( 'http://thiman.me:1337/keshab/', {
  //   type: 'POST',
  //   data: {{title:"training",date:"sdate"}] },
  //   success: function( resp ) {
  //     console.log( resp );
  //   },
  //   error: function( req, status, err ) {
  //     console.log( 'something went wrong', status, err );
  //   }
  // });
  // $.ajax( 'http://thiman.me:1337/keshab/5834a34cf9411adb236ae190/', {
  //   type: 'PATCH',
  //   data: { title: 'using jquery ajax patch', startDate: 'somedate' },
  //   success: function( resp ) {
  //     console.log( resp );
  //   },
  //   error: function( req, status, err ) {
  //     console.log( 'something went wrong', status, err );
  //   }
  // });

  var date = new Date();
  var currentday = date.getDate();
  var currentmonth = date.getMonth();
  var currentyear = date.getFullYear();

  var weekdays = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
  var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];


  var calendarbody = document.querySelector("#main");

  var events = {};
  $.ajax( 'http://thiman.me:1337/keshab', {
    type: 'GET',
    dataType: 'json',
    success: function( resp ) {
      events = resp;
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
    console.log(lastmonthday);

    var d = 1;
    //console.log(t.toLocaleDateString());
    var monthevents = getEvents(t.toLocaleDateString());




    // document.querySelector("#cmonth").innerHTML = new Intl.DateTimeFormat('en-US',{month: 'long'}).format(t);
    // document.querySelector("#cyear").innerHTML = year;

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

          if(monthevents.hasOwnProperty(d) && monthevents[d].length > 0){
            html += '<td class = "event monthevent" data-date="'+d+'" + style="background-color:'+monthevents[d][0].color +';" ><div>'+ t.getDate()+'</div>';
          }
          else
            html += '<td class = "monthevent" data-date="'+d+'"><div>'+ t.getDate()+'</div>';
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

    var d = $("#event-drawer");
    $(".monthevent").click(function(){

      d.removeClass(".hide")
      d.animate({width:'toggle'},500);

      loaddrawer(this.dataset.date,monthevents[this.dataset.date]);

      console.log(this.dataset.date);
    });

    $("#drawer-cls-btn").click(function(){
      d.animate({width:'toggle'},500);
    });
  //   var drawer = document.querySelectorAll(".monthevent");
  //   var drawerclsbtn = document.querySelector("#closedrawer");
  //
  //   var drawerClassList = document.querySelector(".sidedrawer").classList;
  //
  //   drawer.forEach(function(el){
  //     el.addEventListener('click',function(e){
  //       //console.log(this.dataset.date);
  //       //console.log(events);
  //       loaddrawer(this.dataset.date,monthevents[this.dataset.date]);
  //       var drawerdelete = document.querySelectorAll(".deleteevent");
  //
  //       drawerdelete.forEach(function(el){
  //         el.addEventListener('click',function(e){
  //             deleteevent(this.dataset.date);
  //         });
  //       });
  //       drawerClassList.remove("hide");
  //       setTimeout(function(){drawerClassList.remove("slide");},10);
  //
  //     });
  //
  //   });
  //
  //
  // drawerclsbtn.addEventListener('click',function(e){
  //
  //     drawerClassList.add("slide");
  //     setTimeout(function(){drawerClassList.add("hide");},500);
  //
  //
  //   });
  



  }
  loadCalendar(currentyear,currentmonth);
  //var prevmnth = document.querySelector("#prevmonth");
  //var nextmnth = document.querySelector("#nextmonth");
  $(".btn-prev-mnth").click(function(){
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

    return e;
  }

  function loaddrawer(date,dateevents){
  //  var drawer = document.querySelector("#drawercontent");
    var html = "";
    html += '<h1>'+weekdays[new Date(date).getDay()]+' '+ date +'</h1>';
    if( typeof dataevents || dateevents.length < 1){
      html += '<p>No Events</p>';
    } else {
      for(var i = 0; i < dateevents.length; i++){
          var datadate = dateevents[i].hasOwnProperty("parent") ? dateevents[i].parent+"-"+dateevents[i].id : date +"-"+dateevents[i].id;
          html += '<div id="'+datadate+'">';
          html += '<p>'+dateevents[i].title+'<span class="deleteevent" data-date="'+datadate+'">\u00D7</span></p>';
    			html += '<p>'+dateevents[i].starttime+'-'+dateevents[i].endtime+'</p></div>';

      }
    }
    $("#drawercontent").html(html);
  }

  function deleteevent(drawerevent){


  }
});
