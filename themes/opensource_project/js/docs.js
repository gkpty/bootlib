$(document).ready(function(){
  // Add scrollspy to <body>
  $('body').scrollspy({target: ".navbar", offset: 200});   		
  // Add smooth scrolling on all links inside the navbar
  $(".smooth-scroll").on('click', function(event) {
    if (this.hash !== "") {
      event.preventDefault();
      var hash = this.hash;
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 400, function(){
        window.location.hash = hash;
      });
    }
  });
});

$('button').click(function(event) {
  var x = event.target.name;
  document.getElementById(x).classList.toggle("show");
});

$(document).ready(function(){
  $('.dropbtn').click(function(event){
    var caret_id = '#' + event.target.name + '-caret'
    $(caret_id).toggleClass('open')
  })
});