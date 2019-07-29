const express = require('express');
const router = express.Router();

//User model
const db = require('../models/User');

//Catering
router.get('/catering',(req, res)=> res.render('catering'));

// Bake shop,display products

router.get('/bake_shop',(req, res)=>{

   db.query("SELECT * FROM products",(err, result)=>{
    if(err) throw(err);
    console.log(result);
    res.render('bake_shop',{data:result});
  })
});

//Cart route, transfer products to cart object
router.get('/add-to-cart/:id', (req, res)=> {
  const productID = req.params.id;
});

module.exports = router;
