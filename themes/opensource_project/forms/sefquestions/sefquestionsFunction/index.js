
	const uuidv1 = require('uuid/v1');
	const axios = require('axios').default;
	var AWS = require('aws-sdk');
	var ses = new AWS.SES({apiVersion: '2010-12-01'});
	var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

	exports.handler = (event, context, callback) => {
		let obj = {"id":"id","name":"name","email":"email","message":"message"}; 
		let uid = uuidv1();
		
		let secret = "6LfdUNIUAAAAAKRpH0YdlvY8TpCbA5_2UVPP35Lu";
		let response = event.captcha;
		let url = 'https://www.google.com/recaptcha/api/siteverify?secret=' + secret + '&response=' + response;
		axios.post(
			url, 
			{},
			{
				headers: {
					"Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
				},
			},
		)
		.then(function (response) {
			if(response.data.success){
		
				let dbobj = {};
				Object.keys(obj).map(function(key, index) {
					obj[key] = event[key];
					dbobj[key] = {S:event[key]};
				})
				obj['id'] = uid;
				dbobj['id'] = {S:uid};
				let params = {
					Item: dbobj, 
					TableName: "sefquestions",
				};
				var formOutput = '<br>';
				for(let item in obj){	
					formOutput += '<span><b>' + item + ': </b>' + obj[item] + '</span><br>'; 
				}
				var emailBody = 'Someone has filled out the questions form in supereasyforms.com. Bellow are their deatils: <br><FormOutput>'.replace('<FormOutput>', formOutput)
				dynamodb.putItem(params, function(err, data) {
					if (err) {
						callback(err);
					}
					else {
						var params = {
							Destination: {
								ToAddresses: ["gabriel@torus-digital.com"]
							}, 
							Message: {
								Body: {
									Html: {
										Charset: "UTF-8", 
										Data: emailBody
									}, 
									Text: {
										Charset: "UTF-8", 
										Data: "empty"
									}
								}, 
								Subject: {
									Charset: "UTF-8", 
									Data: "super easy forms question"
								}
							}, 
							ReplyToAddresses: [], 
							Source: "mailer@torus-digital.com", 
						};
						ses.sendEmail(params, function(err, data) {
							if (err) {
								callback(err);
							} 
							else {
								callback(null, 'Success');
							}   
						});
					}
				});
			
		}
		else {
			let err = 'invalid recaptcha response';
			callback(err);
		}
		})
		.catch(function (error) {
		callback(error);
		});
		
	};
	