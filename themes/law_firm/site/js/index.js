(function($) {
    "use strict"; // Start of use strict
    // Collapse Navbar
    var navbarCollapse = function() {
        if ($("#mainNav").offset().top > 150) {
        $("#mainNav").addClass("navbar-shrink");
        } else {
        $("#mainNav").removeClass("navbar-shrink");
        }
    };
    // Collapse now if page is not at top
    navbarCollapse();
    // Collapse the navbar when page is scrolled
    $(window).scroll(navbarCollapse);
})(jQuery); // End of use strict

$(function(){
    $('#super-easy-form').submit(function(e){
        e.preventDefault();
        var formdata = toJSONString(this);
        console.log(formdata);
        $.ajax({
            type: "POST",
            url: "https://8bzktolubk.execute-api.us-east-1.amazonaws.com/deployment2019-06-11T23-12-26-422Z/",
            dataType: "json",
            contentType: "application/json",
            data: JSON.stringify( { "id": "","full_name": $('#full_name').val(),"email": $('#email').val(),"message": $('#message').val() } ),
            beforeSend: function(data) {
                $('#super-easy-btn').prop('disabled', true);
                $('#super-easy-form :input').prop('disabled', true);
                $('#contact-status').html('Sending...').show();
            },
            success: function(data) {
                console.log(data);
                $('#contact-status').text("We'll get back to you soon").show();
                $('#super-easy-form :input').removeProp('disabled');
                $('#super-easy-btn').removeProp('disabled');
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#contact-status').text('Error. Please try again soon.').show();
                $('#super-easy-form :input').removeProp('disabled');
                $('#super-easy-btn').removeProp('disabled');
            }
        });
    }); 

    function toJSONString (form) {
    var obj = {};
    var elements = form.querySelectorAll("input, select, textarea");
    for(var i = 0; i < elements.length; ++i) {
        var element = elements[i];
        var name = element.name;
        var value = element.value;
        if(name) {
        obj[name] = value;
        }
        }
        return JSON.stringify(obj);
    }
});

