const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql');
const bcrypt = require('bcrypt');

//Load User model
const User = require('../models/User');
const db = require('../models/User');

module.exports = function(passport){
  passport.use(
     new LocalStrategy({ usernameField: 'user'}, (user, password, done)=>{
      console.log("hello");

      //Match users
      let sql ="SELECT * FROM users WHERE user = ? LIMIT 1";
      let query = db.query(sql, user, (err, result)=>{
        console.log(result);
          if(err) throw err;
          if(!result.length){
            console.log('user doesnt exist');
            return done(null,false, { message: 'user not registered'});
          }
      });
      //Match password
      bcrypt.compare(password, user.password, (err, isMatch)=>{
        if(err) throw err;

        if(isMatch){
          return done(null, user);
        }else{
          return done(null, false, {message:'password incorrect'});
        }
      });
    })
  );
//passport session support
passport.serializeUser((user, done)=> {
  done(null, user.id);
});

passport.deserializeUser((id, done)=> {
  db.findById(id, (err, user)=> {
    done(err, user);
  });
});

}
