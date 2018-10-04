// Using the tools and techniques you learned so far,
// you will scrape a website of your choice, then place the data
// in a MongoDB database. Be sure to make the database and collection
// before running this exercise.

// Consult the assignment files from earlier in class
// if you need a refresher on Cheerio.

// Dependencies
var express = require("express");
// Require request and cheerio. This makes the scraping possible
var request = require("request");
var cheerio = require("cheerio");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var logger = require("morgan");
var mongoose = require("mongoose");

var db = require("./models");

// Initialize Express
var app = express();

app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");

// Database configuration
mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true });

// Main route (simple Hello World Message)
app.get("/", function (req, res) {
  res.render("index", {});
});


app.get("/scrape", function (req, res) {
  let results = [];

  request("http://www.nytimes.com", function (error, response, html) {

    // Load the HTML into cheerio and save it to a variable
    // '$' becomes a shorthand for cheerio's selector commands, much like jQuery's '$'
    var $ = cheerio.load(html);

    // An empty array to save the data that we'll scrape


    // Select each element in the HTML body from which you want information.
    // NOTE: Cheerio selectors function similarly to jQuery's selectors,
    // but be sure to visit the package's npm page to see how it works
    $("article").each(function (i, element) {

      var div = $(element)[0].firstChild.firstChild;
      var link = $(div).find("a").attr("href");
      if (link == undefined) {
        link = "";
      }
      var title = $(div).find("h2").text();
      if (title == undefined) {
        title = "";
      }
      //console.log(title + " " + link);

      // Save these results in an object that we'll push into the results array we defined earlier
      if (title != "" || link != "") {
        results.push({
          id: i,
          title: title,
          link: link
        });
      }
    });
    console.log(results);
    res.render("articles", {
      articles: results
    });
  });

});

app.post("/save", function (req, res) {
  console.log(req.body);
  let article = req.body;
  db.Article.create(article)
    .then(function (dbArticle) {
      // View the added result in the console
      console.log(dbArticle);
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      return res.json(err);
    });
});

app.post("/delete/:id", function (req, res) {
  console.log(req.params.id);
  //let article = req.body;
  db.Article.remove({_id:req.params.id})
    .then(function (dbArticle) {
      // View the added result in the console
      console.log(dbArticle);
      res.json(dbArticle);
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      return res.json(err);
    });
});


app.get("/saved", function (req, res) {
  db.Article.find({})
    .then(function (dbArticles) {
      // If we were able to successfully find Articles, send them back to the client
      res.render("saved", { articles: dbArticles });
    })
    .catch(function (err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
})

// Listen on port 3000
app.listen(3000, function () {
  console.log("App running on port 3000!");
});
