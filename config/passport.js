const LocalStrategy = require('passport-local').Strategy;
const mysql = require('mysql');
const bcrypt = require('bcrypt');

//Load User model
const User = require('../models/User');
const db = require('../models/User');

module.exports = function(passport){


  passport.use(
     new LocalStrategy({ usernameField: 'user'}, (user, password, done)=>{

      //Match users
      let sql ="SELECT * FROM users WHERE user = ? LIMIT 1";
      db.query(sql,user, function(err, result){
        console.log(result);
          if(err)
            return done(err);
          if(!result.length){
            console.log('user  not found');
            return done(null,false, { message: 'user not registered'});
          }

          //Match password
          bcrypt.compare(password, result[0].password, function(err, isMatch){
            if(err)
            return done(err);

            if(isMatch){
              return done(null, result[0]);
            }else{
              return done(null, false, {message:'password incorrect'});
            }
          });
      });


    })
  );

  //passport session support
  passport.serializeUser(function(user, done){
    done(null, user.id);
  });

  passport.deserializeUser(function(id,done){
    db.query('SELECT * FROM users WHERE id = ?', [id], function(err, result) {
      done(err, result[0]);
    });
  });

}
