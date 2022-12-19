var express 			 = require("express"),
 	app     			 = express(),
 	bodyParser  		 = require("body-parser"),
	mongoose 			 = require("mongoose"),
	passport 			 = require("passport"),
	LocalStrategy		 = require("passport-local"),
	passportLocalMongoose= require("passport-local-mongoose"),
	Campground  	 	 = require("./models/Campground"),
	Comment				 = require("./models/Comment"),
	User				 = require("./models/user"),
	seedDB				 = require("./seeds"),
	flash				 = require("connect-flash"),
	methodOverride		 = require("method-override");

// requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")

app.use(bodyParser.urlencoded({extended : true}));
app.set("view engine", "ejs");

var url = process.env.DBURL || "mongodb://localhost/yelp_camp";
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});

app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
	secret : "abc",
	resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 
// seedDB();

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	return next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

var port = process.env.PORT || 3000 ;
app.listen(port,function(){
	console.log("The YelpCamp Server has started!!");
});