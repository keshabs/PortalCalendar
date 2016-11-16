var date = new Date();
var day = date.getDate();
var month = date.getMonth();
var year = date.getFullYear();

var weekdays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var daysinmonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

var t = new Date(year,month,1);
var startday = t.getDay();

var d = 1;

for(var i = 0; i < 5; i++){
  for(var j = 0; j < 7; j++){
    if((i==0 && j<startday)||d>daysinmonth[1]){
      console.log("N");
    }else{
      console.log(d);
      d++;
    }
  }
  if(d>daysinmonth[1]){
    break;
  }
  console.log("new week");

}
