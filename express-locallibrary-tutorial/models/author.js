const mongoose = require("mongoose");
const { DateTime } = require("luxon");


const Schema = mongoose.Schema;

const AuthorSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  date_of_birth: { type: Date },
  date_of_death: { type: Date },
});

// Virtual for author's full name
AuthorSchema.virtual("name").get(function () {
  // To avoid errors in cases where an author does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
});

// Virtual for author's URL
AuthorSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/author/${this._id}`;
});

AuthorSchema.virtual("lifespan").get(function(){
  
  let datespan = new Date(this.date_of_death - this.date_of_birth);
  let lsy = datespan.getFullYear();
  return lsy;


});


AuthorSchema.virtual("formdatebirth").get(function(){
  
  let temp =  new Date(this.date_of_birth)

  return temp.toISOString().split('T')[0];


});


AuthorSchema.virtual("formdatedeath").get(function(){
  
  let temp =  new Date(this.date_of_death)

  if(!this.date_of_death){
    return ''
  }
  return temp.toISOString().split('T')[0];


});

// Export model
module.exports = mongoose.model("Author", AuthorSchema);
