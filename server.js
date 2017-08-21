/* Note Taker (18.2.6)
 * backend
 * ==================== */

// Dependencies
var express = require("express");
var mongojs = require("mongojs");
var bodyParser = require("body-parser");
var logger = require("morgan");

var app = express();

// Set the app up with morgan, body-parser, and a static folder
app.use(logger("dev"));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(express.static("public"));

// Database configuration
var databaseUrl = "week18day2";
var collections = ["notes"];

// Hook mongojs config to db variable
var db = mongojs(databaseUrl, collections);

// Log any mongojs errors to console
db.on("error", function(error) {
  console.log("Database Error:", error);
});


// Routes
// ======

// Simple index route
app.get("/", function(req, res) {
  res.send(index.html);
});


// TODO: You will make six more routes. Each will use mongojs methods
// to interact with your mongoDB database, as instructed below.
// -/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/-/


// 1. Save a note to the database's collection
// ===========================================
app.post("/submit", function(req,res){
	console.log(req.body);
	//insert note into notes collection
	db.notes.insert(req.body, function (error, saved){
		//log any errors
		if (error){
			console.log(error);
		}
		//otherwise send to browser
		//this will fire off success function of the ajax request
		else{
			res.send(saved);
		}
	});
});



// 2. Retrieve all notes from the database's collection
// ====================================================
app.get("/all", function(req, res){
	//find all notes in the notes collection
	db.notes.find({}, function(error, found){
		//log any errors
		if(error){
			console.log(error);
		}
		//otherwise send json of the notes back to user
		//will fire off the success of the ajax request
		else{
			res.json(found);
		}
	});
});



// 3. Retrieve one note in the database's collection by it's ObjectId
// TIP: when searching by an id, the id needs to be passed in
// as (mongojs.ObjectId(IDYOUWANTTOFIND))
// ==================================================================
app.get("/find/:id", function(req, res){
	//find just one result in the notes collection
	db.notes.findOne({
		//using id in the url
		"_id": mongojs.ObjectId(req.params.id)
	}, function (error, found){
		//log any errors
		if (error){
			console.log(error);
			res.send(error);
		}
		//otherwise send the note to the browser
		//will fire off the success of the function of the ajax request
		else{
			console.log(found);
			res.send(found);
		}
	});

});



// 4. Update one note in the database's collection by it's ObjectId
// (remember, mongojs.ObjectId(IDYOUWANTTOFIND)
// ================================================================
app.post("/update/:id", function (req, res){
	db.notes.update({
		"_id": mongojs.ObjectId(req.params.id)
	}, {
		//set title, note, and modified parameters
		//sent in the req's body
		$set:{
			"title":req.body.title,
			"note":req.body.note,
			"modified": Date.now()
		}
	}, function(error, edited){
		//log any errors from mongojs
		if(error){
			console.log(error);
			res.send(error);
		}
		//otherwise send the mongojs response to the browser
		//this will fire off the success of the ajax request
		else{
			console.log(edited);
			res.send(edited);
		}
	});
});



// 5. Delete one note from the database's collection by it's ObjectId
// (remember, mongojs.ObjectId(IDYOUWANTTOFIND)
// ==================================================================
app.get("/delete/:id", function (req, res){
	//remove a note using objectID
	db.notes.remove({
		"_id": mongojs.ObjectId(req.params.id)
	}, function(error, removed){
		//log any errors from mongojs
		if (error){
			console.log(error);
			res.send(error);
		}
		//otherwise send mongojs response to the browser
		//this will fire off the success of the ajax request
		else{
			console.log(removed);
			res.send(removed);
		}
	});
});



// 6. Clear the entire note collection
// ===================================
app.get("/clearall", function (req, res){
	//remove every note from teh notes collection
	db.notes.remove({}, function (error, response){
		//log any errors
		if (error){
			console.log(error);
			res.send(error);
		}
		//otherwise send mongojs response to the browser
		//this will fire off the success of the ajax request
		else{
			console.log(response);
			res.send(response);
		}
	});
});


// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});