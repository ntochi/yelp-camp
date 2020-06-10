//Import modules
const passportLocalMongoose = require("passport-local-mongoose"),
session                     = require('express-session'),
methodOverride              = require("method-override"),
LocalStrategy 	            = require("passport-local"),
flash                       = require("connect-flash"),
bodyParser                  = require("body-parser"),
mongoose 	                = require("mongoose"),
passport                    = require("passport"),
express                     = require("express"),
app                         = express();


const Campground       	    = require("./models/campground"),
Comment 		            = require("./models/comment"),
User                        = require("./models/user"),
seedDB			            = require("./seeds");

const campgroundRoutes      = require("./routes/campgrounds"),
	  commentRoutes         = require("./routes/comments"),
	  indexRoutes           = require("./routes/index");
 

//Middleware configuration
const port = process.env.PORT || 3000;
mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
// mongoose.set('debug', true);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");
seedDB();

//Passport configuration
app.use(session({
	secret: 'I like tater tots',
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Render for every page
app.use(function(req, res, next){
	//currentUser variable: Show/hide auth links in navbar correctly
	res.locals.currentUser = req.user;
	//error & success variables: flash message
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});

//Routes configuration
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



app.listen(port, function(){
	console.log("YelpCamp Server Has Started!");
});