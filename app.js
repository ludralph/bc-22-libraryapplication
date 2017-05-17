'using strict';
// including app dependencies
const express  = require('express');
const session = require('express-session');
const passport = require('passport');
const expressValidator = require('express-validator');
const LocalStrategy = require('passport-local').Strategy;
const multer  = require('multer');
const uploads = multer({dest:'./uploads'});
const flash  = require('connect-flash');
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser');
// end of app dependencies

//Set up mongoose connection
const mongoose = require('mongoose');

var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database


//routes
const routes = require('./routes/index');
const user = require('./routes/users');

// init app
const app = express();

//define static file to use
app.use(express.static("public"));

// define view engine to use
app.set("view engine", "ejs");

//bodyparser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extend:false}));
app.use(cookieParser());

//session handling
app.use(session({
  secret:'secret',
  saveUninitialized:true,
  resave:true
}));

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//validation
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// middleware messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

app.use('/',routes);
app.use('/users',user);

app.listen(3000,()=>{
  console.log("library server running");
});

module.exports = app;
