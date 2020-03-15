

  
  // Close the dropdown if the user clicks outside of it

  $('button').click(function(event) {
      var x = event.target.name;
      document.getElementById(x).classList.toggle("show");
});