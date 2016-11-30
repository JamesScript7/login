var Sequelize = require('sequelize');
var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var passwordHash = require('password-hash');

var dbFileName = "app.db";
var devDatabaseURL = "sqlite://" + dbFileName;
var sequelize = new Sequelize(process.env.DATABASE_URL || devDatabaseURL);

var Account = sequelize.define('Account', {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});

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
  Account.findOne({
    where: { username: req.body.username }
  }).then(function(row) {
    console.log(row.dataValues);

    var correctPW = passwordHash.verify(req.body.password, row.dataValues.password);

    if (correctPW) {
      req.session.userID = row.dataValues.id;
      res.send(`Logged in as ${row.dataValues.username}!`);
    } else {
      console.error("Incorrect password");
      res.status(401).send("Could not login!");
    }
  }).catch(function(err) {
    console.error(err);
    res.status(401).send("Could not login!");
  });
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

sequelize.sync().then(function() {
  app.listen(app.get('port'), function() {
    console.log("Server started on port " + app.get('port'));
  });
});
