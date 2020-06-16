const express = require("express");
const router = express.Router({mergeParams: true});
const Campground = require("../models/campground");
const Comment = require("../models/comment");
const middleware = require("../middleware")



//Nested resources
//New
router.get("/new", middleware.isLoggedIn, function (req, res){
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
router.post("/", middleware.isLoggedIn, function (req, res){
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
					req.flash("success", "Thank you for your review!");
					res.redirect("/campgrounds/" + foundCampground._id);
				}
			});
		}
	});
});


//Edit
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
	//render edit template with that comment
	res.render("comments/edit", {campground_id: req.params.id, comment: req.comment});
});

//Update
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			res.redirect("back");
		} else {
			req.flash("success", "Comment updated!");
			res.redirect("/campgrounds/" + req.params.id);
		}
	});
});


//Destroy
router.delete("/:comment_id", middleware.isLoggedIn, middleware.checkCommentOwnership, function(req, res){
    //findByIdAndRemove
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
       if(err){
           res.redirect("back");
       } else {
			req.flash("error", "Comment deleted!");
        	res.redirect("/campgrounds/" + req.params.id);
       }
    });
});



module.exports = router;