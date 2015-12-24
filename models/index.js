var mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/volunteerMe")
module.exports.User = require("./user");