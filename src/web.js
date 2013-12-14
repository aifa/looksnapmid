var express = require("express");
var http = require('http');
var helperModule = require("./server/lib.js");

var app = express();

app.use(express.logger());
//New call to compress content
app.use(express.compress());
app.use(express.static(__dirname + '/client'));
app.set('views', __dirname + '/client');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.post('/bcksubmit', function(req, res) {
	 var type = req.params.type;
	 var data='' ;
	 req.on('data', function(buffer){
		 data += buffer;
	 });
	 
	 req.on('end', function(buffer){
		 var submissionData = JSON.parse(data);
		 console.log(submissionData);
		 if (submissionData!=null){
			 res.writeHead(200);
			 res.write(data);
			 res.end();
		 }else{
			 res.writeHead(400);
			 res.end();
		 }
	 });
});


/**
 * post method for uploading an image on the server
 */
app.post('/imgsubmit', function(req, res) {
	var type = req.params.type;
	var data='' ;
	 
	 req.on('data', function(buffer){
		 data += buffer;
	 });
	 
	 req.on('end', function(buffer){
		 //var submissionData = JSON.parse(data);
		 console.log(data);
		 if (data!=null){
				//create imgResponse
			var imgRequest = {
					  info: "looksnap img request",
					  imgData: data	  
			};

			 var imgRequestString = JSON.stringify(imgRequest);
			 var headers = {
						  'Content-Type': 'application/json',
						  'Content-Length': imgRequestString.length
						};
			 
			var options = {
					  host: 'localhost',
					  port: 5000,
					  path: '/bcksubmit',
					  method: 'POST',
					  headers:headers
					};
			
			// Setup the request.  The options parameter is
			// the object we defined above.
			var reqBack = http.request(options, function(resBck) {
			  resBck.setEncoding('utf-8');

			  var responseString = '';

			  resBck.on('data', function(data) {
			    responseString += data;
			  });

			  resBck.on('end', function() {
			    //console.log(responseString);

				setTimeout(function() {
				    res.render('product');
			    }, 1800);

			  });
			});
			
			reqBack.write(imgRequestString);
			reqBack.end();
		 
		 }else{
			 res.writeHead(400);
			 res.end();
		 }
	 });
	 	 
});

var port = process.env.PORT || 5000;

app.listen(port, function() {
  console.log("Listening on " + port);
});