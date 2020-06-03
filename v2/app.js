//Import modules
const passportLocalMongoose = require("passport-local-mongoose"),
Campground       			= require("./models/campground"),
Comment 		            = require("./models/comment"),
session                     = require('express-session'),
LocalStrategy 	            = require("passport-local"),
User                        = require("./models/user"),
bodyParser                  = require("body-parser"),
mongoose 	                = require("mongoose"),
passport                    = require("passport"),
express                     = require("express"),
seedDB			            = require("./seeds");


//Middleware Configuration
const app = express();
seedDB();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });

//Passport Configuration
app.use(session({ 
	secret: 'I like tater tots',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
//Responsible for encoding & decoding sessions
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//Show/hide auth links in navbar correctly
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
 });


//ROUTES
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
			res.render("campgrounds/index", {campground: allCampgrounds});
		}
	});
});

//NEW- show form to create campground
app.get("/campgrounds/new", isLoggedIn, function(req, res){
	res.render("campgrounds/new");
});

//CREATE- add new campground to database
app.post("/campgrounds", isLoggedIn, function(req, res){
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
//Nested resources
app.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res){
	Campground.findById(req.params.id, function (err, foundCampground){
		if (err) {
			console.log(err)
		} else {
			res.render("comments/new", {campground: foundCampground});
		}
	});
});

app.post("/campgrounds/:id/comments", isLoggedIn, function (req, res){
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


//===================
// AUTH ROUTES
//===================
//Register routes
app.get("/register", function(req, res){
	res.render("register");
});

app.post("/register", function(req, res){
	User.register(new User({username: req.body.username}), req.body.password, function(err, newUser){
	   if(err){
		   console.log(err);
		   return res.render('register');
	   }
	   passport.authenticate("local")(req, res, function(){
		  res.redirect("/campgrounds");
	   });
   });
});

//Login routes
app.get("/login", function(req, res){
	res.render("login");
});

app.post("/login", passport.authenticate("local", { 
	successRedirect: "/campgrounds", 
	failureRedirect: "/login"
}), function(req, res){

});

//Logout route
app.get("/logout", function(req, res){
	//destroy all the user data in the session
	req.logout();
	res.redirect("/");
});

//Middleware to check if user is logged in
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } else {
		res.redirect("/login");
	}
}



const port = process.env.PORT || 3000;

app.listen(port, function(){
	console.log("YelpCamp Server Has Started!");
});