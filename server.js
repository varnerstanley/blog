const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");


const homeStartingContent = "It's working!";

const app = express();



const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || "postgres://odin:sonofodin@localhost:5432/blog";

const pool = new Pool({connectionString: connectionString});
app.set("port", (process.env.PORT || 3000));




app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));



let posts = [];



app.get("/gPosts", getPosts);

function getPosts(req, res) {
    console.log(req.params.id);
    var id = req.params.id;
    const post = req.params.post_title;
    const text = req.params.post_text;

    getPostFromDb(id, function(error, result) {

      console.log("Back from getPostFromDb db function with result: ", result);
      res.json(result);
    });

};

function getPostFromDb(callback){
  var sql = "SELECT post_id, post_title, post_text FROM posts";

  pool.query(sql, function(err, result) {
    if (err){
      console.log("error with db occurred");
      console.log(err);
      callback(err, null);
    }
    // console.log("Found db result: " + JSON.stringify(result.rows));

    callback(null, result.rows);
  });

  // Set up a JSON object of the values we want to pass along to the EJS result page
	// const params = {post: post, text: text};

  // var rates = {LettersS: .55, LettersM: .5, LargeEF: 1, FCP: 3.66};

  // res.render("home", params);
  // console.log("I made it this far");
}



app.get("/home", function(req, res){
  getAllPosts();
  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts
    });
});

function getAllPosts() {

    getPostFromDb(function(error, result) {

      console.log("Back from getPostFromDb db function with result: ", result);
      posts = result;
    });

};



app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  var sql = "INSERT INTO posts (post_title, post_text, post_date) VALUES ($1, $2, $3)";
  pool.query(sql, [req.body.postTitle, req.body.postBody, new Date()], function(err, result) {
    if (err){
      console.log("error with db occurred");
      console.log(err);
      res.json(err);
    }
    posts.push({post_title: req.body.postTitle, post_text: req.body.postBody});
    res.redirect("/home");
  });
});


app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });

});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function() {
  console.log("Server has started successfully");
});
