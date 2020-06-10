const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");


router.get("/", function (req, res) {
	res.render("landing");
});

//Register routes
router.get("/register", function(req, res){
	res.render("register");
});

router.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, newUser){
	   if(err){
		   req.flash("error", err.message);
		   console.log(err);
		   return res.render('register');
	   }
	   passport.authenticate("local")(req, res, function(){
			req.flash("success", "Welcome to YelpCamp!")
			res.redirect("/campgrounds");
	   });
   });
});

//Login routes
router.get("/login", function(req, res){
	res.render("login");
});

router.post("/login", passport.authenticate("local", { 
	successRedirect: "/campgrounds", 
	failureRedirect: "/login"
}), function(req, res){

});

//Logout route
router.get("/logout", function(req, res){
	//destroy all the user data in the session
	req.logout();
	req.flash("success", "Successfully logged out");
	res.redirect("/");
});



module.exports = router;