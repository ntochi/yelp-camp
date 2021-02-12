const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middleware = require("../middleware")



//INDEX- show all campgrounds
router.get('/', async (req, res) => {
	try {
		//Get all campgrounds from database
		const campgrounds = await Campground.find({});
		//Render campgrounds from database
		res.render("campgrounds/index", { campgrounds });
	
	} catch (err) {
		console.log("Caught an error!")
        console.log("error is:", err)
	}
})


//NEW- show form to create campground
router.get('/new', middleware.isLoggedIn, (req, res) => {
	res.render('camgrounds/new')
});

//CREATE- add new campground to database
router.post('/', middleware.isLoggedIn, async (req, res) => {
	// Get data from form, save to database then redirect
    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})

// router.post("/", middleware.isLoggedIn, function(req, res){
// 	//Get data from form & save to database
// 	const author = {
// 		id: req.user._id,
// 		username: req.user.username
// 	}
// 	const newCampground = {
// 		name: req.body.campground.name,
// 		price: req.body.campground.price,
// 		image: req.body.campground.image,
// 		description: req.body.campground.description,
// 		author: author
// 	}

// 	Campground.create(newCampground, function(err, newlyCreated){
// 		if (err) {
// 			console.log(err);
// 		} else {
// 			req.flash("success", "Campground created!");
// 			res.redirect("/campgrounds");
// 		}
// 	});
// });

//SHOW- show more info about one campground
router.get('/:id', async (req, res) => {
	try {
		//Find the campground with the provided ID
		const campground = await Campground.findById(req.params.id);
		//Render show template with that campground
		res.render("campgrounds/show", { campground });

	} catch (err) {
		console.log("Caught an error!")
        console.log("error is:", err)		
	}
})


// router.get("/:id", function (req, res){
// 	//Find the campground with the provided ID
// 	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
// 		if(err || !foundCampground){
// 			console.log(err);
// 		} else {
// 			//Render show template with that campground
// 			res.render("campgrounds/show", {campground: foundCampground});
// 		}
// 	});
// });


//EDIT- display form to edit one campground
router.get("/:id/edit", middleware.checkCampgroundOwnership, async (req, res) => {
	//Find the campground with the provided ID
	const campground = await Campground.findById(req.params.id);
	// Render edit template with that campground
    res.render("campgrounds/edit", { campground });
});

//UPDATE- update particular campground, then redirect
router.put("/:id", middleware.checkCampgroundOwnership, async (req, res) => {
	// req.body.campground.body = req.sanitize(req.body.campground.body)
	const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate( id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
});

//DESTROY- delete a particular campground, then redirect
router.delete("/:id", middleware.checkCampgroundOwnership, async(req, res) => {
	try {
		let foundCampground = await Campground.findById(req.params.id);
		await foundCampground.remove();
		req.flash("error", "Campground deleted!")
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