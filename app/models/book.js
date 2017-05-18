const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BookSchema = Schema({
  title: {
    type: String,
     required: true
   },
  author: {
    type: Schema.ObjectId,
    ref: 'Author',
    required: true
  },
    imageUrl: {
    type: String,
    required: true
  },
  genre: [{type: Schema.ObjectId, ref: 'Genre'}]
});

// Virtual for book's URL
BookSchema
.virtual('url')
.get(function () {
  return `/catalog/book/${this._id}`;
});

//Export model
module.exports = mongoose.model('Book', BookSchema);
