module.exports = function(app, passport) {
  // // Require controller modules
  // var book_controller = require('../controller/bookController');
  // var genre_controller = require('../controller/categoryController');
  // var book_instance_controller = require('../controller/bookinstanceController');

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/',function(req, res) {
        res.render('index.ejs');
    });

    app.get('/catalog', isLoggedIn, function(req, res){
      res.render('catalog.ejs');
    });

 // admin routes
 app.get('/admin', function(req,res){
    res.render('login.ejs',{message: req.flash('loginMessage')});
 }) ;

 // process the admin login form
 app.post('/admin', passport.authenticate('local-login', {
     successRedirect : '/admin', // redirect to the admin page
     failureRedirect : '/login', // redirect back to the signup page if there is an error
     failureFlash : true // allow flash messages
 }));

// end of admin routes

  // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });

    // LOGOUT ==============================
    app.get('/logout', , function(req, res) {
        req.logout();
        res.redirect('/');
    });

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/catalog', // redirect to the homepage
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/register', function(req, res) {
            res.render('register.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/register', passport.authenticate('local-signup', {
            successRedirect : '/login', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));


// =============================================================================
// AUTHORIZE (ALREADY LOGGED IN=============
// =============================================================================

    // locally --------------------------------
        app.get('/connect/local', function(req, res) {
            res.render('connect-local.ejs', { message: req.flash('loginMessage') });
        });
        app.post('/connect/local', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/connect/local', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));


// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}


};
