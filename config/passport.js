const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");
const brcypt = require("bcryptjs");
//mongodb user schema for user login
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});
const User = mongoose.model('User', userSchema);


module.exports = (passport) => {
//stores user details in session
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

//access user details in session
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(error, user) {
      done(error, user);
    });
  });

  passport.use(
//passport strategy to validate user
    new LocalStrategy({
      passReqToCallback: true,
      usernameField: 'email'
    }, (req, email, password, done) => {
      User.findOne({
          email: email
        })
        .then(user => {
          if (!user) {
            return done(null, false, req.flash('error_msg', 'Email is invalid'));
          }

          //Compare Password using bcrypt hash
          brcypt.compare(password, user.password, (error, isMatch) => {
            if (error) throw error;

            if (isMatch) {
              return done(null, user);
            } else {
              return done(null, false, req.flash('error_msg', 'Incorrect password'));
            }
          });

        })
        .catch(error => console.log(error))
    })
  );

}
