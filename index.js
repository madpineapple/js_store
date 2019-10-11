require('dotenv').config();
const mysql = require('mysql');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const bodyParser = require('body-parser');
const path = require('path');
const flash = require('connect-flash');
const passport = require('passport');
const multer = require('multer');


//set up app
const app = express();

const db = require('./models/User');


//Passport config
require('./config/passport')(passport);
//bodyParser
app.use(express.urlencoded({ extended: false }));
//ejs
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.static('public'));

const sessionStore = new MySQLStore({}/* session store options */, db);


//Express session + mysql session
app.use(session({
  secret:"keyboard cat",
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie:{ maxAge: 100 * 60 * 100 }
}));


//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash());

//Global varaiables
app.use((req, res, next)=>{
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

//make my authentication status available
app.use((req,res,next)=>{
  res.locals.login = req.isAuthenticated();
  res.locals.user = req.user;
  res.locals.session = req.session;
  next();
});

//Routes
app.use ('/', require('./routes/app.js'));
app.use ('/users', require('./routes/users.js'));
app.use ('/other', require('./routes/other.js'));


const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server started on port ${PORT}`));
