// Create the required custom methods at the bottom of this file

var mongoose = require("mongoose");

// Save a reference to the Schema constructor
var Schema = mongoose.Schema;

var ArticleSchema = new Schema({
  // `headline` must be of type String
  // `headline` will trim leading and trailing whitespace before it's saved
  headline: {
    type: String,
    trim: true
  },
  // `link` must be of type String
  // `link` will trim leading and trailing whitespace before it's saved
  link: {
    type: String,
    trim: true
  },
  // `date` must be of type Date. The default value is the current date
  addedOn: {
    type: Date,
    default: Date.now
  }
});

// This creates our model from the above schema, using mongoose's model method
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
