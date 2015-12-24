var express = require("express");
var path = require("path");
var mongoose = require("mongoose");
var db = require("./models");
var bodyParser = require("body-parser");
var session = require("express-session");
var _ = require("underscore");

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));

app.use(session({
	secret: "super secret",
	resave: false,
	saveUninitialized: true
}))


var views = path.join(__dirname, "views");

app.get("/", function (req, res) {
	var homePath = path.join(views, "home.html");
	res.sendFile(homePath);
});

app.use("/", function (req, res, next) {
	req.login = function (user) {
		req.session.userId = user._id;
		req.user = user;
		return user;
	};

	req.currentUser = function (cb) {
		var userId = req.session.userId;
		db.User.findOne({
			_id: userId
		}, cb);
	};

	req.logout = function () {
		req.session.userId = null;
		req.user = null;
	}

	next();
});

app.get("/signup", function (req, res) {
	res.sendFile(path.join(views, "signup.html"));
});

app.get("/login", function (req, res) {
	res.sendFile(path.join(views, "login.html"));
});

app.get("/profile", function (req, res) {
	req.currentUser(function (err, user) {
		if (!err) {
			currentUser = user;
			res.sendFile(path.join(views, "/profile.html"));
		} else {
			res.redirect("/login");
		}	
	})
});

var currentUser;
app.get("/currentUser", function (req, res) {
	console.log("current user is: ", currentUser);
	res.send(currentUser);
})

app.get("/logout", function (req, res) {
	req.logout();
	res.redirect("/");
});

app.post("/login", function (req, res) {
	var user = req.body.user;

	db.User.authenticate(user.email, user.password, function (err, user) {
		if (!err) {
			req.login(user);
			res.redirectTo("/profile");
		} else {
			res.redirect("/login");
		};
	});
});

app.post("/signup", function (req, res) {
	var user = req.body.user;
	db.User.createSecure(user.firstName, user.lastName, user.location, user.email, user.password, function(err, user) {
		if (user) {
			req.login(user);
			res.redirect("/profile");
		} else {
			res.redirect("/signup");
			console.log(err);
		};
	});
})

app.listen(3000, function (req, res) {
	console.log("listening on port 3000");
});