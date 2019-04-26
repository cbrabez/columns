var express = require("express");
var app         = express();
var appJS       = require('../app');
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
var utils = require('../public/scripts/utils');
var LocalStrategy = require("passport-local").Strategy;
var RememberMeStrategy = require('passport-remember-me-extended').Strategy;


/* Fake, in-memory database of remember me tokens */

var tokens = {}

function consumeRememberMeToken(token, fn) {
  var uid = tokens[token];
  // invalidate the single-use token
  delete tokens[token];
  console.log("TOKEN CONSUMED!  " + token);
  return fn(null, uid);
}

function saveRememberMeToken(token, uid, fn) {
  tokens[token] = uid;
  return fn();
}


// Use the LocalStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.  In the real world, this would query a database;
//   however, in this example we are using a baked-in set of users.
passport.use(new LocalStrategy(
  function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      console.log(username);
      console.log(password);
      // Find the user by username.  If there is no user with the given
      // username, or the password is not correct, set the user to `false` to
      // indicate failure and set a flash message.  Otherwise, return the
      // authenticated `user`.
      User.findOne({'username': username}, function(err, user) {
          console.log('IM IN USER IS:   ' + user.id);
        if (err) { return done(err); }
        if (!user) { return done(null, false, { message: 'Unknown user ' + username });}
        if (user.comparePassword(password)) {return done(null, false, { message: 'Invalid password' }); }
        return done(null, user);
      });
    });
  }
));
module.exports = {
    
  issueToken: function (user, done) {
     var token = utils.randomString(64);
  saveRememberMeToken(token, user.id, function(err) {
    if (err) { return done(err); }
    return done(null, token);
  })
      
  }
}
// Remember Me cookie strategy
//   This strategy consumes a remember me token, supplying the user the
//   token was originally issued to.  The token is single-use, so a new
//   token is then issued to replace it.
passport.use(new RememberMeStrategy(
  function(token, done) {
    consumeRememberMeToken(token, function(err, uid) {
      if (err) { return done(err); }
      if (!uid) { return done(null, false); }
        User.findById(uid, function(err, user) {
        console.log('USER ID: ' + uid);
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user);
      });
    });
  },
  issueToken
));


function issueToken(user, done) {
  var token = utils.randomString(64);
  saveRememberMeToken(token, user.id, function(err) {
    if (err) { return done(err); }
    return done(null, token);
  });
}


// root route
router.get("/", function(req, res){
    res.render('login');
});

// register form route
router.get("/register", function(req, res) {
    res.render("register");
});

// sign up route
router.post("/register", function(req, res) {
    var newUser = new User({username: req.body.username});
    console.log("Register ROUTE!!!");
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            req.flash("error", err.message);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            req.flash("success", "Welcome to ScratchPad " + user.username);
            res.redirect("projects/5c9ce5f10e60f30aea6e3caf");
        });
    });
});



// POST /login
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the primary route function function will be called,
//   which, in this example, will redirect the user to the home page.
//
//   curl -v -d "username=bob&password=secret" http://127.0.0.1:3000/login
router.post('/login', passport.authenticate('local', { failureRedirect: '/login', failureFlash: true }),
  function(req, res, next) {
    // Issue a remember me cookie if the option was checked
    if (!req.body.remember_me) { return next(); }
    
    issueToken(req.user, function(err, token) {
        console.log("LOGIN ROUTE!!!");
      if (err) { return next(err); }
      res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 });
      console.log("COOKIE SET");
      console.log(token);
      return next();
    });
  },
  function(req, res) {
    res.redirect('/tasks');
  });

router.get('/logout', function(req, res){
  // clear the remember me cookie when logging out
  res.clearCookie('remember_me');
  req.logout();
  res.redirect('/');
});



// login form route
router.get("/login", function(req, res) {
    res.render('login', { user: req.user, message: req.flash('error') });
});
/*
// handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/projects/5c9ce5f10e60f30aea6e3caf",
        failureRedirect: "/login"
    }), function(req, res) {
});

//logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/projects/5c9ce5f10e60f30aea6e3cafkli");
});
*/



module.exports = router;