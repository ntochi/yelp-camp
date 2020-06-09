const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware")


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
router.get("/new", middleware.isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//CREATE- add new campground to database
router.post("/", middleware.isLoggedIn, function(req, res){
	//Get data from form & save to database
	const author = {
		id: req.user._id,
		username: req.user.username
	}
	const newCampground = {
		name: req.body.campground.name,
		image: req.body.campground.image,
		description: req.body.campground.description,
		author: author
	}

	Campground.create(newCampground, function(err, newlyCreated){
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

//EDIT- display form to edit one campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
	Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
	});
});

//UPDATE- update particular campground, then redirect
router.put("/:id", middleware.checkCampgroundOwnership, function (req, res){
	// req.body.campground.body = req.sanitize(req.body.campground.body)
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id)
		}
	});
});

//DESTROY- delete a particular campground, then redirect
router.delete("/:id", middleware.checkCampgroundOwnership, async(req, res) => {
	try {
		let foundCampground = await Campground.findById(req.params.id);
		await foundCampground.remove();
		res.redirect("/campgrounds");
	} catch (error) {
		console.log(error.message);
		res.redirect("/campgrounds");
	}
});

// router.delete("/:id", function (req, res){
// 	Campground.findByIdAndRemove(req.params.id, function(err){
// 		if(err){
// 			res.redirect("/campgrounds")
// 		} else {
// 			res.redirect("/campgrounds")
// 		}
// 	});
// });


module.exports = router;