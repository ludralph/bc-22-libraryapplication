const express  = require('express');
const app = express();
//Set up mongoose connection
const mongoose = require('mongoose');
const dbUrl = "mongodb://ludralph:presh1986@ds143141.mlab.com:43141/library_app";
const mongoDB = dbUrl;
mongoose.connect(mongoDB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//define static file to use
app.use(express.static("public"));
app.set("view engine", "ejs");






app.listen(3000,()=>{
  console.log("libray server running");
})
