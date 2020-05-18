const express    = require("express"),
	  app        = express(),
	  request    = require("request"),
      bodyParser = require("body-parser"),
      mongoose   = require("mongoose");



app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
//Create yelp_camp database inside of MongoDB
mongoose.connect("mongodb://localhost/yelp_camp");



//Set-up Schema
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
});

//Compile Schema into a model to access methods
var Campground = mongoose.model("Campground", campgroundSchema);

// Campground.create(
// {
// 	name: "Pennsylvania Site 7",
// 	image: "https://img.hipcamp.com/image/upload/c_limit,f_auto,h_630,q_60,w_1200/v1470118754/campground-photos/nww9bs0esrmzyok92jgf.jpg"

// },function(err, campground){

//     if(err){
//         console.log(err);
//     } else {
//         console.log("NEWLY CREATED CAMPGROUND: ");
//         console.log(campground);
//     }
// });


app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
	//Get all campgrounds from database
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else{
			//Render campgrounds from database
			res.render("campgrounds", {campground: allCampgrounds});
		}
	});	
	
});

//Post request & logic of form which redirects to /campgrounds
app.post("/campgrounds", function(req, res){
	//Get data from form & add to campgrounds array
	const name = req.body.name;
	const image = req.body.image;
	const newCampground = {name: name, image: image};
	//Create a new campground & save to database
	Campground.create(newCampground, function(err, newlyCreated){
		if(err){
			console.log(err);
		} else{
			//Redirect back to campgrounds page
			res.redirect("/campgrounds");
		}
	});
	
});

app.get("/campgrounds/new", function(req, res){
	//Show form to post new campgrounds
	res.render("new", {campground: Campground});
});


const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log("YelpCamp Server Has Started!");
});