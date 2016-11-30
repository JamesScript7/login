var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();

app.set('port', process.env.PORT || 3000);

app.use(session({
  secret: 'password-protected site',
  resave: false,
  saveUninitialized: true
}));
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/login', function(req, res) {
  if (req.body.username == "daniel") {
    req.session.userID = 123;
    res.send(`Logged in as ${req.body.username}!`);
  } else {
    res.status(401).send("Could not login!");
  }
});

app.get('/logout', function(req, res) {
  req.session.userID = null;
  res.send("Logged out!");
});

//password protect everything else
app.use(function(req, res, next) {
  if (req.session.userID) {
    next();
    return;
  }

  res.status(401).send("Please login to view this page.");
});

app.get("/", function(req, res) {
  res.send("Welcome to my private lair!");
});

app.listen(app.get('port'), function() {
  console.log("Server started on port " + app.get('port'));
});
