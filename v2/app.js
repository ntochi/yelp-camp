//App Config
const bodyParser = require("body-parser"),
Campground 		 = require("./models/campground"),
Comment 		 = require("./models/comment"),
mongoose 		 = require("mongoose"),
express          = require("express"),
seedDB			 = require("./seeds");


// Middleware
const app = express();
seedDB();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });




app.get("/", function (req, res) {
	res.render("campgrounds/landing");
});

//INDEX- show all campgrounds
app.get("/campgrounds", function (req, res) {
	//Get all campgrounds from database
	Campground.find({}, function (err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else {
			//Render campgrounds from database
			res.render("campgrounds/index", { campground: allCampgrounds });
		}
	});
});

//NEW- show form to create campground
app.get("/campgrounds/new", function(req, res){
	res.render("campgrounds/new");
});

//CREATE- add new campground to database
app.post("/campgrounds", function(req, res){
	//Get data from form & save to database
	Campground.create(req.body.campground, function(err, newCampground){
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
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			//Render show template with that campground
			res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});


//===================
// COMMENTS ROUTES
//===================
app.get("/campgrounds/:id/comments/new", function (req, res){
	Campground.findById(req.params.id, function (err, foundCampground){
		if (err) {
			console.log(err)
		} else {
			res.render("comments/new", {campground: foundCampground});
		}
	});
});

app.post("/campgrounds/:id/comments", function (req, res){
	//Find campground
	Campground.findById(req.params.id, function (err, foundCampground){
		if (err) {
			console.log(err)
			res.redirect("/campgrounds")
		} else {
			//Create comment
			Comment.create(req.body.comment, function(err, comment){
				if (err) {
					console.log(err)
				} else {
					//Connect comment with campground
					foundCampground.comments.push(comment);
					foundCampground.save();
					//Redirect to show page
					res.redirect("/campgrounds/" + foundCampground._id);
				}
			});
		}
	});
});







const port = process.env.PORT || 3000;

app.listen(port, function(){
	console.log("YelpCamp Server Has Started!");
});