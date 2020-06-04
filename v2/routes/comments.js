const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground.js");
const Comment = require("../models/comment.js");



//Nested resources
router.get("/new", isLoggedIn, function (req, res){
	//Find campground using ID
	Campground.findById(req.params.id, function (err, foundCampground){
		if (err) {
			console.log(err)
		} else {
			res.render("comments/new", {campground: foundCampground});
		}
	});
});

router.post("/", isLoggedIn, function (req, res){
	//Find campground using ID
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


//Middleware to check if user is logged in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
		res.redirect("/login");
	}
}

module.exports = router;