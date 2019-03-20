const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");


const homeStartingContent = "It's working!";

const app = express();

const { Pool } = require("pg");

const connectionString = process.env.DATABASE_URL || "postgres://odin:sonofodin@localhost:5432/blog";
const pool = new Pool({connectionString: connectionString});

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

app.get("/", getPosts);

function getPosts(req, res) {
    var id = req.query.id;

    getPostFromDb(id, function(error, result) {

      console.log("Back from getPostFromDb db function with result: ", result);
      res.json(result);
    });
};

function getPostFromDb(id, callback){
  console.log("get post from db called with id: ", id);

  var sql = "SELECT post_id, post_title, post_text FROM posts WHERE post_id = $1::int";
  var params = [id];

  pool.query(sql, params, function(err, result) {
    if (err){
      console.log("error with db occurred");
      console.log(err);
      callback(err, null);
    }
    console.log("Found db result: " + JSON.stringify(result.rows));

    callback(null, result.rows);
  });
}

app.get("/home", function(req, res){
  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts
    });
});
app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };

  posts.push(post);

  res.redirect("/");

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
