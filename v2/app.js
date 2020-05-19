const express = require("express"),
	app = express(),
	request = require("request"),
	bodyParser = require("body-parser"),
	mongoose = require("mongoose");



app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
//Create yelp_camp database inside of MongoDB
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });




//Set-up Schema
var campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
	description: String
});

//Compile Schema into a model to access methods
var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
// {
// 	name: "Granite Hill",
// 	image: "https://i.pinimg.com/originals/39/3f/5a/393f5a20d7ec52f36901aaecf57320ba.jpg",
// 	description: "This is a beautiful granite hill. No bathrooms. No water. Just granite."
// }, function(err, campground){

//     if(err){
//         console.log(err);
//     } else {
//         console.log("NEWLY CREATED CAMPGROUND: ");
//         console.log(campground);
//     }
// });


app.get("/", function (req, res) {
	res.render("landing");
});

//INDEX- show all campgrounds
app.get("/campgrounds", function (req, res) {
	//Get all campgrounds from database
	Campground.find({}, function (err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else {
			//Render campgrounds from database
			res.render("index", { campground: allCampgrounds });
		}
	});
});

//CREATE- add new campground to database
//Post request & logic of form which redirects to /campgrounds
app.post("/campgrounds", function (req, res) {
	//Get data from form & add to campgrounds array
	//req.body.xxx; represents the name attribute in the form
	const name = req.body.name;
	const image = req.body.image;
	const desc = req.body.description;
	const newCampground = { name: name, image: image, description: desc};
	//Create a new campground & save to database
	Campground.create(newCampground, function (err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			//Redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});
});

//NEW- show form to create campground
app.get("/campgrounds/new", function (req, res) {
	//Show form to post new campgrounds
	res.render("new", { campground: Campground });
});

//SHOW- shows more info about one campground
app.get("/campgrounds/:id", function (req, res){
	//Find the campground with the provided ID
	Campground.findById(req.params.id, function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			//Render show template with that campground
			res.render("show", {campground: foundCampground});
		}
	});
});



const port = process.env.PORT || 3000;

app.listen(port, function () {
	console.log("YelpCamp Server Has Started!");
});