//Create User for login

var Sequelize = require('sequelize');
var passwordHash = require('password-hash');

var dbFileName = "app.db";
var sequelize = new Sequelize("sqlite://" + dbFileName);

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

var newUsername = "daniel",
    newPassword = "nycda123";

sequelize.sync().then(function() {
  var hashedPassword = passwordHash.generate(newPassword);
  return Account.create({
    username: newUsername,
    password: hashedPassword 
  });
}).then(function(result) {
  console.log(`Created account: id = ${result.dataValues.id}`);
});
