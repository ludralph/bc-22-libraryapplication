#! /usr/bin/env node

console.log('This script populates a some test books, authors categories and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb://your_username:your_password@your_dabase_url');

//Get arguments passed on command line
var userArgs = process.argv.slice(2);
if (!userArgs[0].startsWith('mongodb://')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}

var async = require('async')
var Book = require('./app/models/book')
var Author = require('./app/models/author')
var Category = require('./app/models/category')
var BookInstance = require('./app/models/bookinstance')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB);
var db = mongoose.connection;
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

var authors = []
var categorys = []
var books = []
var bookinstances = []

// function authorCreate(firstName,lastName,cb) {
//   authordetail = {firstName:firstName , lastName: lastName }
//
//
//   var author = new Author(authordetail);
//
//   author.save(function (err) {
//     if (err) {
//       cb(err, null)
//       return
//     }
//     console.log('New Author: ' + author);
//     authors.push(author)
//     cb(null, author)
//   }  );
// }

// function categoryCreate(name, cb) {
//   var category = new Category({ name: name });
//
//   category.save(function (err) {
//     if (err) {
//       cb(err, null);
//       return;
//     }
//     console.log('New category: ' + category);
//     categorys.push(category)
//     cb(null, category);
//   }   );
// }

function bookCreate(title,author,imageUrl,category, cb) {
  bookdetail = {
    title: title,
    author: author,
    imageUrl : imageUrl
  }
  if (category != false) bookdetail.category = category

  var book = new Book(bookdetail);
  book.save(function (err) {
    if (err) {
      //cb(err, null)
      return
    }
    console.log('New Book: ' + book);
    books.push(book)
    //cb(null, book)
  }  );
}


function bookInstanceCreate(book, imprint, due_back, status, cb) {
  bookinstancedetail = {
    book: book,
    imprint: imprint
  }
  if (due_back != false) bookinstancedetail.due_back = due_back
  if (status != false) bookinstancedetail.status = status

  var bookinstance = new BookInstance(bookinstancedetail);
  bookinstance.save(function (err) {
    if (err) {
      console.log('ERROR CREATING BookInstance: ' + bookinstance);
      cb(err, null)
      return
    }
    console.log('New BookInstance: ' + bookinstance);
    bookinstances.push(bookinstance)
    cb(null, book)
  }  );
}


// function createcategoryAuthors(cb) {
//     async.parallel([
//         function(callback) {
//           //authorCreate('Cory', 'Altoff', callback);
//         },
//         function(callback) {
//           //authorCreate('Eric', 'Matthes', callback);
//         },
//         function(callback) {
//           //authorCreate('Christy', 'Wright', callback);
//         },
//         ],
//         // optional callback
//         cb);
// }


function createBooks(cb) {
    async.parallel([

        function(callback) {
          bookCreate('Python Crash Course: A Hands-On, Project-Based Introduction to Programming ','Eric Matthes','http://bit.ly/2pWNBP45Yn', authors[1], [categorys[1],], callback);
        },
        function(callback) {
          bookCreate('Business Boutique: A Woman\'s Guide for Making Money Doing What She Loves','Christy Wright','http://bit.ly/2ru8G4R', authors[1], [categorys[1],], callback);
        },
        function(callback) {
          bookCreate('The self taught programmer','Cory Althoff' ,'http://bit.ly/2pWNBP45yn', authors[0],[categorys[0],], callback);
        }
        ],
        // optional callback
        cb);
}


function createBookInstances(cb) {
    async.parallel([
        function(callback) {
          bookInstanceCreate(books[0], 'London Gollancz, 2014.', false, 'Available', callback)
        },
        function(callback) {
          bookInstanceCreate(books[1], ' Gollancz, 2011.', false, 'Loaned', callback)
        },
        function(callback) {
          bookInstanceCreate(books[2], ' Gollancz, 2015.', false, false, callback)
        },
        function(callback) {
          bookInstanceCreate(books[3], 'New York Tom Doherty Associates, 2016.', false, 'Available', callback)
        }
        ],
        // optional callback
        cb);
}

async.series([
    //createcategoryAuthors,
    createBooks,
    createBookInstances
],
// optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('BOOKInstances: '+bookinstances);

    }
    //All done, disconnect from database
    mongoose.connection.close();
});
