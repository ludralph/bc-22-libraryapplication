const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const BookInstanceSchema = Schema({
  book: { type: Schema.ObjectId, ref: 'Book', required: true }, //reference to the associated book
  imprint: {type: String, required: true},
  status: {type: String, required: true, enum: ['Available', 'Loaned'], default: 'Available'},
  due_back: {type: Date, default: Date.now},
});

// Virtual for bookinstance's URL
BookInstanceSchema
.virtual('url')
.get(function () {
  return `/catalog/bookinstance/${this._id}`;
});

//Export model
module.exports =  mongoose.model('BookInstance', BookInstanceSchema);
