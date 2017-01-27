//load required package
var path = require('path');
var express = require('express');
var compression = require('compression');
var secrets = require('./config/secrets');
var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

//connect twitatron to MongoDb
mongoose.connect(secrets.db);

//load controllers
var homeController = require('./controllers/home');
var authController = require('./controllers/auth');

//express application
var app = express();

//tell express to use sessions
app.use(session({
	secret: secrets.sessionSecret,
	resave:false,
	saveUninitialized: false,
}));

//use the passport package in our app
app.use(passport.initialize());
app.use(passport.session());

//add content compression
app.use(compression({
	threshold: false
}));

//add static middleware
var oneDay = 86400000; 
app.use(express.static(path.join(__dirname,'public'), { maxAge: oneDay }));

//add jade view engine
app.set('views',path.join(__dirname, 'views'));
app.set('view engine', 'jade');
 
//setup objects needed by views
app.use(function(req, res, next){
	res.locals.user = req.user;
	next();
});

//creating express router
var router = express.Router();

//initial route for testing
router.get('/', homeController.index);

//Auth routes
router.get('/auth/twitter', authController.twitter);
router.get('/auth/twitter/callback', authController.twitterCallback, function(req, res) {
	res.redirect(req.session.returnTo || '/');
router.get('/auth/logout', authController.logout);
});

//register routes
app.use(router);

//start server
app.listen(3000);

