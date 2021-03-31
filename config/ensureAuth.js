module.exports = {
//to check if user is logged in
  isLoggedIn: function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error_msg', 'Requested resource not accessible! Please login.');
    res.redirect('/');
  }
};
