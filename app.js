//dotenv to access proces.env variables
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const ejs = require("ejs");
const port = process.env.PORT || "8000";
const mysql = require("mysql");
const mongoose = require("mongoose");
// using expression to handle user sessions
const session = require("express-session");
//using passport for authentication
const passport = require("passport");
//using flash to set success and error messages
const flash = require("connect-flash");
const mongoDB = require("./config/mongodb").mongoURL;

// checks if user is logged in
const {
  isLoggedIn
} = require("./config/ensureAuth");

require("./config/passport")(passport);

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).
then(() => console.log("connectd to mongoDB"))
  .catch(error => console.log(error));
mongoose.set("useCreateIndex", true);

app.use(bodyParser.urlencoded({
  extended: true
}));

//using session
app.use(session({
  secret: process.env.SECRET_KEY,
  resave: true,
  saveUninitialized: true
}));

//using passport and intializing session
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

app.use(flash());

// setting global session variables for flashing success and error messages
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  next();
});

app.set('view engine', 'ejs');

app.use(express.static(__dirname + "/public"));

//initial redirect on server startup
app.get("/", (req, res) => {
  //checks if the user is already signed in, if so redirected to homepage
  if (req.user) {
    res.redirect("/home");
  } else {
    res.render("login");
  }
});

app.route("/login")
  .get((req, res) => {
    res.render("login");
  }).post((req, res, next) => {
    //verifying user credentials
    passport.authenticate('local', {
      successRedirect: '/home',
      failureRedirect: "/",
      failureFlash: true
    })(req, res, next);
  });

app.get("/home", isLoggedIn, (req, res) => {
  res.render("home");
});

app.get("/logout", (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect("/login");
});

//express route handlers
app.use("/patients", require(__dirname + "/routes/patients"));
app.use("/prescriptions", require(__dirname + "/routes/prescriptions"));
app.use("/drugs", require(__dirname + "/routes/drugs"));
app.use("/doctors", require(__dirname + "/routes/doctors"));
app.use("/contracts", require(__dirname + "/routes/contracts"));

//starting server on port
app.listen(port, () => {
  console.log(`Server has started successfully on ${port}`);
});
