$(function(){
		$('#super-easy-form').submit(function(e){
			e.preventDefault();
			var formdata = toJSONString(this);
			console.log(formdata);
			$.ajax({
				type: "POST",
				url: "https://0586wfeeu4.execute-api.us-east-1.amazonaws.com/deployment2019-08-06T01-51-15-149Z/",
				dataType: "json",
				contentType: "application/json",
				data: JSON.stringify( { "id": "","first_name": $('#first_name').val(),"last_name": $('#last_name').val(),"organization": $('#organization').val(),"city": $('#city').val(),"state": $('#state').val(),"country": $('#country').val(),"postal_code": $('#postal_code').val(),"email": $('#email').val(),"phone_number": $('#phone_number').val(),"message": $('#message').val() } ),
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
				