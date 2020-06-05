//Import modules
const passportLocalMongoose = require("passport-local-mongoose"),
session                     = require('express-session'),
methodOverride              = require("method-override"),
LocalStrategy 	            = require("passport-local"),
bodyParser                  = require("body-parser"),
mongoose 	                = require("mongoose"),
passport                    = require("passport"),
express                     = require("express"),
app                         = express();


const Campground       	    = require("./v2/models/campground"),
Comment 		            = require("./v2/models/comment"),
User                        = require("./v2/models/user"),
seedDB			            = require("./v2/seeds");

const campgroundRoutes      = require("./v2/routes/campgrounds"),
	  commentRoutes         = require("./v2/routes/comments"),
	  indexRoutes           = require("./v2/routes/index");
 

//Middleware configuration
const port = process.env.PORT || 3000;
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
// mongoose.set('debug', true);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
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

//Show/hide auth links in navbar correctly
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

//Routes configuration
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);



app.listen(port, function(){
	console.log("YelpCamp Server Has Started!");
});