

var weekdays = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
var localevents = {};


  function loaddrawer(date){
  //  var drawer = document.querySelector("#drawercontent");
    var html = "";

    html += '<h1 id="drawertitle">'+weekdays[(new Date(date).getDay()+1)%7]+' '+ date +'</h1>';

    if( !monthevents.hasOwnProperty(date) || monthevents[date].length < 1){
      html += '<p>No Events</p>';
    } else {
      var dateevents = monthevents[date];
      for(var i = 0; i < dateevents.length; i++){
          html += '<div><p>'+dateevents[i].Title+'</p>';
          var s = new Date(dateevents[i].StartDate);
          var e = new Date(dateevents[i].EndDate);
          html += '<p>'+s.getHours()+':'+s.getMinutes()+'-'+e.getHours()+':'+e.getMinutes()+'</p>';
          html += '<p><button class="delete-btn" data-id="'+dateevents[i]._id+'">Delete</button><button class="edit-btn" data-id="'+dateevents[i]._id+'">Edit</button></p></div>';
      }
    }
    $("#drawercontent").html(html);
    var drawerdelete = document.querySelectorAll(".delete-btn");

    drawerdelete.forEach(function(el){
      el.addEventListener('click',function(e){
          deleteevent(date,this.dataset.id);
      });
    });

    $(".edit-btn").click(function(){
      editevent(date,this.dataset.id);
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

      }

      },
      error: function( req, status, err ) {
        console.log( 'something went wrong', status, err );
      }
    });

  }

  var eventform = $(".eventform");
  var outsideform = $(".outsideform");


  function editevent(date,id){
    editing = true;
    editid = id;
    var e = {};
    for(var i = 0; i < monthevents[date].length; i++){
      if(monthevents[date][i]._id === id){
        e = monthevents[date][i];
        break;
      }
    }

    $('input[name="StartDate"]').val(e["StartDate"].slice(0,10));
    $('input[name="Title"]').val(e["Title"]);
    $('input[name="Description"]').val(e["Description"]);

    // $.each(e,function(key,value){
    //   $('input[name="'+key+'"]').val(value);
    // });
    eventform.removeClass("hide");
    outsideform.addClass("dark");



  }



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
    console.log(d[2].value);
    var startDate = getDate(d[1].value,d[2].value);
    var endDate = getDate(d[1].value,d[3].value);
    var e = {
      Title: d[0].value,
      StartDate: startDate,
      EndDate: endDate,
      Repeat: d[4].value,
      Description: d[5].value
    }
    var t = "";
    var url = 'http://localhost:3000/events';
    if(editing){
      t = "PATCH";
      url += '/'+editid;
      editing = false;
    }else{
      t = "POST";
    }
    $.ajax( url, {
      type: t,
      dataType: 'json',
      data: e,
      success: function( resp ) {
        if(resp.hasOwnProperty("error")){
          alert(resp.error);
        }else {
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
