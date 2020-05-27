//App Config
const Campground = require("./models/campground"),
	  bodyParser = require("body-parser"),
	  mongoose = require("mongoose"),
	  express = require("express"),
	  app = express()

	  

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });


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

//NEW- show form to create campground
app.get("/campgrounds/new", function (req, res) {
	//Show form to post new campgrounds
	res.render("new");
});

//CREATE- add new campground to database
//Post request & logic of form which then redirects to /campgrounds
app.post("/campgrounds", function (req, res) {
	//Get data from form & save to database
	//req.body.xxx; represents using the name attribute in form to send data to the server
	const name = req.body.name;
	const image = req.body.image;
	const desc = req.body.description;
	const newCampground = { name: name, image: image, description: desc};

	Campground.create(newCampground, function (err, newlyCreated) {
		if (err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
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

app.listen(port, function(){
	console.log("YelpCamp Server Has Started!");
});