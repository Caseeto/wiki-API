const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://ashishsaranshi:ashuas@cluster0.xriv1c7.mongodb.net/wikiDB", {useNewUrlParser: true});

const articleSchema = {
  title: String,
  content: String
};

const Article = mongoose.model("Article", articleSchema);

///////////////////////////// Whole articles ///////////////////////////////////

app.route("/articles")

.get(function(req, res) {
  Article.find().then(
    function(foundArticles) {
      res.send(foundArticles);
    }
  ).catch(function(err) {
    res.send(err);
  });
})

.post(function(req, res) {
  const newArticle = new Article({
    title: req.body.title,
    content: req.body.content
  });
  newArticle.save().then(
    function(success) {
      res.send("Successfully added a new articles.");
    }
  ).catch(function(err) {
    res.send(err);
  });
})

.delete(function(req,res) {
  Article.deleteMany().then(
    function(success) {
      res.send("deleted successfully.");
    }
  ).catch(function(err) {
    res.send(err);
  });
});

/////////////////////////// Specific article ///////////////////////////////////

app.route("/articles/:articleTitle")

.get(function(req, res) {
  Article.findOne({title: req.params.articleTitle}).then(
    function(foundArticle) {
      if(foundArticle){
        res.send(foundArticle);
      } else {
        res.send("No articles matching that title was found.")
      }
    }
  ).catch(
    function(err) {
      res.send(err);
    }
  )
})

            //NOTE: update(condition, update)----> findOneAndUpdate(filter, update)

.put(function(req, res) {
  Article.findOneAndUpdate(
    {title: req.params.articleTitle},
    {title: req.body.title, content: req.body.content}).then(
      function() {
        res.send("Successfully updated article.");
      }
    ).catch(function(err) {
      res.send(err);
    })
})

.patch(function(req, res) {
  Article.findOneAndUpdate(
    {title: req.params.articleTitle},
    {$set: req.body}).then(
      function() {
        res.send("Successfully updated article.");
      }
    ).catch(function(err) {
      res.send(err);
    })
})

.delete(function(req,res) {
  Article.deleteOne({title: req.params.articleTitle}).then(
    function(success) {
      res.send("Specific article deleted successfully.");
    }
  ).catch(function(err) {
    res.send(err);
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
