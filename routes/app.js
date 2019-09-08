const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const Cart = require("../models/cart");

//User model
const db = require('../models/User');

router.get('/',(req, res)=>res.render('welcome',));
router.get('/about',(req, res)=> res.render('about'));


router.get('/dashboard',ensureAuthenticated,(req, res)=>
res.render('dashboard',{
name: req.user.user
}));

//products routes
//Catering
router.get('/catering',(req, res)=> res.render('catering'));

// Bake shop,display products

router.get('/bake_shop',(req, res)=>{

   db.query("SELECT * FROM products",(err, result)=>{
    if(err) throw(err);

    //paginate(hopefully)
    const pageSize = 2; //how many results by page
    const pageCount = Math.ceil(result.length/pageSize);
    let currentPage = 1; //set current page
    let resultArray = [];
    let resultList = [];

    //insert data into array
    while( result.length > 0){
      resultArray.push(result.splice(0, pageSize));
    }
    //set current page if specifed as get variable (eg: /?page=2)
	if (typeof req.query.page !== 'undefined') {
		currentPage = +req.query.page;
	}
  //show list of products
	resultList = resultArray[+currentPage - 1];
//render page and pass  data to page
    res.render('bake_shop',{
      data:resultList,
      pageSize: pageSize,
		  pageCount: pageCount,
		  currentPage: currentPage
    });
  });

});

//Cart route, transfer products to cart object
router.get("/add_to_cart/:id:price", (req, res, next)=> {
  //check if cart has an object otherwise pass empty object
  const productID = req.params.id;
  const productPrice = req.params.price;
  const name = find(productID);

  
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  //mysql statement find product by // ID
  let sql ="SELECT * FROM products WHERE id = ? LIMIT 1";
  let query = db.query(sql, productID, (err, result )=>{
      if(err) throw err;
      // console.log(result);
      if(result.length){


        cart.add(result, productID, productPrice, name);
        req.session.cart= cart;
        console.log(req.session.cart);
        res.redirect("/view_cart");
      }
  });
});

//function find
function find(productID){
  let sql="SELECT name FROM products WHERE id = ? LIMIT 1";
  let query = db.query(sql, productID, (err, name )=>{
 if(err){
   throw err;
 }
 if(name.length){

   console.log(name);
   return name;
 }
});
}
//View cart route
router.get('/view_cart', (req,res)=>{
  if(!req.session.cart){
    return res.render('view_cart', {products: null});
  }
  const cart = new Cart(req.session.cart);
  res.render('view_cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});

//checkout route
router.get('/checkout',(req,res)=>{
  //check to see if a shopping cart exists
    if(!req.session.cart){
        return res.redirect('/view_cart');
    }
    const cart = new Cart(req.session.cart);
    const errMsg = req.flash('error')[0];
    return res.render('checkout',{total: cart.totalPrice, errMsg: errMsg, noErrors: !errMsg});
  });




module.exports = router;
