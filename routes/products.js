const express = require('express');
const router = express.Router();

//User model
const db = require('../models/User');

//Bake Shop
// router.get('/bake_shop',(req, res)=> res.render('bake_shop'));

//Catering
router.get('/catering',(req, res)=> res.render('catering'));

//Display products

router.get('/bake_shop',(req, res)=>{

   db.query("SELECT * FROM products",(err, result)=>{
    if(err) throw(err);
    console.log(result);
    res.render('bake_shop',{data:result});
  })
});

module.exports = router;
