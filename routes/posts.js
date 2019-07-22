const express = require('express');
const router = express.Router();

//User model
const db = require('../models/User');

//Bake Shop
router.get('/bake_shop',(req, res)=> res.render('bake_shop'));

//Catering
router.get('/catering',(req, res)=> res.render('catering'));

//Display products
router.post('/bake_shop',(req, res)=>{
  db.query('SELECT* FROM products', function(err, rows){
    if(err){
      console.log(err);
    }
    console.log(rows[0]);
  });
});

module.exports = router;
