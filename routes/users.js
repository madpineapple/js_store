const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');
const csrf = require('csurf');
const multer = require('multer');

const csrfProtection = csrf();
router.use(csrfProtection);

//User model
const db = require('../models/User');
//Login
router.get('/login',(req, res)=> res.render('login',{csrfToken:req.csrfToken()}));

//Register Page
router.get('/register',(req, res)=> res.render('register',{csrfToken:req.csrfToken()}));

router.get('/update',(req, res)=> res.render('update',{csrfToken:req.csrfToken()}));

//update Handle
router.get('/login',(req, res)=> res.render('login',{csrfToken:req.csrfToken()}));

// Register Handle
router.post('/register', (req, res) => {
  console.log(req.body);
  const {user, email, password, password2} = req.body;
  let errors = [];

  //Check required fields
  if(!user || !email || !password || !password2){
    errors.push({ msg : "Please fill in all fields"});
  }

  //Check password match
  if(password !== password2){
    errors.push({ msg : "Passwords don't match!"});
  }

  //Check password length
  if(password.length <6){
    errors.push({msg : "Password should be at least 6 characters long"});
  }

  if(errors.length >0){
    res.render('register',{
      errors,
      user,
      email,
      password,
      password2
    });
  }else{
    //Verify user doesn't already exist
    if(user){
        let sql ="SELECT * FROM users WHERE user = ? LIMIT 1";
        let query = db.query(sql, user, (err, result)=>{
            if(err) throw err;
            console.log(result);
            if(result.length){
              req.flash('error_msg','User already exists! Try again.');
              res.redirect("/users/register");
            }else{
              create(user, password, email);
            }

        });
  }

  //create new user and hash password
function create(user,password, email){

  bcrypt.genSalt(10, (error, salt) => bcrypt.hash(password , salt, (err, hash)=> {
    if(err) throw err;
    //set password to hash
    password= hash;
    console.log(password);

    var users = [
      user,
      email,
      hash
    ];
    let sql = "INSERT INTO users (user, email, password) VALUES (?, ?, ?)";
    let query = db.query(sql, users, (err, result)=>{
       if(err) throw err;
       console.log(result);
       req.flash('success_msg','You are now registered! Please login.');
       res.redirect("/users/login");
     });

  }));

}

}

});
//Login Handle
router.post('/login',(req, res, next)=>{
passport.authenticate('local', {
  successRedirect:"/dashboard",
  failureRedirect:'/users/login',
  failureFlash:true
 })(req,res,next);
});

//Logout
router.get('/logout', (req,res)=>{
  req.logout();
  req.flash('success_msg', 'logged out');
  res.redirect('/users/login');
});

//Update post
router.post('/update', (req, res)=>{
  console.log(req.body)
 let id = Number(req.body.id)
  let sql =`UPDATE users SET user = ?, address= ?,city=?, country= ?, zip=?, email= ? WHERE id=?`;
  db.query(sql,[req.body.name,req.body.address,req.body.city,req.body.country,req.body.zip,
    req.body.email,id], (err, result)=>{
      if(err){
        throw err;
      }
      else{
        res.redirect('/dashboard')
      }
    })
  });


module.exports = router;
