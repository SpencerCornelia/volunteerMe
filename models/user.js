var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var bcrypt = require("bcrypt");
var salt = bcrypt.genSaltSync(10);

var userSchema = new Schema({
	firstName: { type: String, required: true },
	lastName: { type: String, required: true },
	email: String,
	password: { type: String, required: true },
	location: { type: Number, max: 5 }
});

userSchema.statics.createSecure = function (firstName, lastName, email, password, location, cb) {
  var that = this;
  bcrypt.genSalt(function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      console.log("this is the createSecure hash: " + hash);
      that.create({
      	firstName: firstName,
      	lastName: lastName,
        email: email,
        passwordDigest: hash,
        location: location
       }, cb)
    });
  })
};

userSchema.statics.encryptPassword = function (password) {
   var hash = bcrypt.hashSync(password, salt);
   return hash;
 };


userSchema.statics.authenticate = function(email, password, cb) {
  this.find({
     email: email
    }, 
    function(err, user){
      if (user === null){
        throw new Error("Username does not exist");
      } else if (user.checkPassword(password)){
        cb(null, user);
      }

    })
 }
userSchema.methods.checkPassword = function(password) {
        return bcrypt.compareSync(password, this.passwordDigest);
};

var User = mongoose.model("User", userSchema);

module.exports = User;
