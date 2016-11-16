var drawer = document.querySelector(".monthevent");
var drawerclsbtn = document.querySelector("#closedrawer");

drawer.addEventListener('click',function(e){
  document.querySelector(".sidedrawer").classList.remove("hide");
});


drawerclsbtn.addEventListener('click',function(e){
  document.querySelector(".sidedrawer").classList.add("hide");

});
