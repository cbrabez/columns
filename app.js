var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    flash       = require("connect-flash"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Task     = require("./models/task"),
    User        = require("./models/user"),
    seedDB      = require("./seeds")

// requiring routes
var taskRoutes       = require("./routes/tasks"),
    indexRoutes         = require("./routes/index");

// mongoose.connect(process.env.DATABASEURL);
mongoose.connect("mongodb://cbrabez:password12345@ds117189.mlab.com:17189/columns_dev");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
seedDB(); // seeding the database

// passport configuration
app.use(require("express-session")({
    secret: "Paul und Marie sind super!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/tasks", taskRoutes);

// Server Setup

// OFFLINE
const port = 3000;

app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err)
  }

  console.log(`server is listening on ${port}`)
})


// ONLINE
/*
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Columns Server has started!");
});
*/