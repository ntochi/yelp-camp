const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");


//INDEX- show all campgrounds
router.get("/", function (req, res) {
	//Get all campgrounds from database
	Campground.find({}, function (err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else {
			//Render campgrounds from database
			res.render("campgrounds/index", {campground: allCampgrounds});
		}
	});
});

//NEW- show form to create campground
router.get("/new", isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//CREATE- add new campground to database
router.post("/", isLoggedIn, function(req, res){
	//Get data from form & save to database
	Campground.create(req.body.campground, function(err, newCampground){
		if (err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
});

//SHOW- show more info about one campground
router.get("/:id", function (req, res){
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

//Middleware to check if user is logged in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
		res.redirect("/login");
	}
}

module.exports = router;