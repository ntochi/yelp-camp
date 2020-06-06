const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground.js");
const Comment = require("../models/comment.js");



//Nested resources
//New
router.get("/new", isLoggedIn, function (req, res){
	//Find campground using ID
	Campground.findById(req.params.id, function (err, foundCampground){
		if (err) {
			console.log(err)
		} else {
			res.render("comments/new", {campground: foundCampground}) //define campground to access id (req.params.id) in template;
		}
	});
});

//Create
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
					//Add id & username to comment, then save
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
					comment.save();
					//Add & save comment to campground, then redirect
					foundCampground.comments.push(comment);
					foundCampground.save();
					res.redirect("/campgrounds/" + foundCampground._id);
				}
			});
		}
	});
});


//Edit
router.get("/:comment_id/edit", function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			res.redirect("back");
		} else {
		  res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
		}
	});
});

//Update
router.put("/:comment_id", function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


//Destroy
router.delete("/:comment_id", function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
           res.redirect("/campgrounds/" + req.params.id);
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