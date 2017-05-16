import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const AuthorSchema = Schema(
  {
    firstName: {type: String, required: true, max: 100},
    lastName: {type: String, required: true, max: 100},
    dateOfBirth: {type: Date}

  }
);

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function () {
  return `${this.family_name}, ${this.first_name}`;
});

// Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function () {
  return `/catalog/author/${this._id}`;
});

//Export model
export default mongoose.model('Author', AuthorSchema);
