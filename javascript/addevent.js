
var btn = document.querySelector("#add-btn");
var clsbtn = document.querySelector("#close-btn");

var outsideform = document.querySelector("#main");





btn.addEventListener('click',function(e){
  document.querySelector(".eventform").classList.remove("hide");
  outsideform.classList.add("dark");

});

clsbtn.addEventListener('click',function(e){
  document.querySelector(".eventform").classList.add("hide");
    outsideform.classList.remove("dark");
});

outsideform.addEventListener('click',function(e){
  document.querySelector(".eventform").classList.add("hide");
    outsideform.classList.remove("dark");
});
