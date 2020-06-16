var Campground = require("../models/campground");
var Comment = require("../models/comment");

const middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
            // Check if foundCampground exists, and if it doesn't throw an error via connect-flash & redirect to homepage
            if(err || !foundCampground){
                console.log(err);
                req.flash("error", "Campground not found.");
                res.redirect("/campgrounds");
            } else if (foundCampground.author.id.equals(req.user._id) || req.user.isAdmin){
                // does user own the campground?
                req.campground = foundCampground;
                return next();
            } else {
                req.flash("error", "Permission denied")
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    } else {
        req.flash("error", "Please login first");
        res.redirect("/login");
    }    
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            // Check if foundComment exists, and if it doesn't throw an error via connect-flash & redirect to homepage
            if(err || !foundComment){
                console.log(err);
                req.flash('error', 'Sorry, that comment does not exist!');
                res.redirect('/campgrounds');
            } else if (foundComment.author.id.equals(req.user._id || req.user.isAdmin)){
                // does user own the comment?
                req.comment = foundComment;
                return next();
            } else {
                req.flash("error", "Permission denied")
                res.redirect("/campgrounds/" + req.params.id);
            }
        });
    } else {
        req.flash("error", "Please login first");
        res.redirect("/login");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
        req.flash("error", "Please login first");
        res.redirect("/login");
    }
}





module.exports = middlewareObj;