var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/volunteerMe")
module.exports.User = require("./user");