const express = require('express');
const router = express.Router();

// router.get('/',(request,response)=>{
// /
// });

router.get('/register', (request, response) => {
  // render the page and pass in any flash data if it exists
  response.render('register.ejs', {
    message: request.flash('signupMessage')
  });
});

//process the signup form
// router.post('/signup', do all our passport stuff here);

// =====================================
// PROFILE SECTION =====================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
router.get('/profile', isLoggedIn, function(request, response) {
  res.render('profile.ejs', {
    user: request.user // get the user out of session and pass to template
  });
});


router.get('/login', function(request, response) {

  // render the page and pass in any flash data if it exists
  response.render('login.ejs', {
    message: request.flash('loginMessage')
  });
});


// =====================================
   // LOGOUT ==============================
   // =====================================
   router.get('/logout', function(request, response) {
       request.logout();
       response.redirect('/');
   });


// route middleware to make sure a user is logged in
function isLoggedIn(request, response, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}


module.exports = router;
