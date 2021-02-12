// Import modules
const passportLocalMongoose = require('passport-local-mongoose');
const session = require('express-session');
const methodOverride = require('method-override');
const LocalStrategy = require('passport-local');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const passport = require('passport');
const express = require('express');
const path = require('path');

const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User = require('./models/user');
const seedDB = require('./seeds/index');

const campgroundRoutes = require('./routes/campgrounds');
const commentRoutes = require('./routes/comments');
const indexRoutes = require('./routes/index');
const port = process.env.PORT || 3000;


mongoose.connect('mongodb://localhost:27017/yelp_camp', {
	useNewUrlParser: true, 
	useCreateIndex: true,
	useUnifiedTopology: true
});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
	console.log('Database connected');
});

const app = express();


app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// * Render for every page
app.use(express.urlencoded({ extended: true }));
// app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());


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

app.use(function(req, res, next){
	//currentUser variable: Show/hide auth links in navbar correctly
	res.locals.currentUser = req.user;
	//error & success variables: flash message
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

//Routes configuration
app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);


app.listen(port, () => {
	console.log('YelpCamp Server Has Started!');
});