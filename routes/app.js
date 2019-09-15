const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const Cart = require("../models/cart");
const stripe = require('stripe')('SECRET KEY');



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

    //pagination variables
    const pageSize = 6; //how many results by page
    const pageCount = Math.ceil(result.length/pageSize);
    let currentPage = 1; //set current page
    let resultArray = [];
    let resultList = [];

    //insert data into array
    while( result.length > 0){
      for(var i = 0; i <result.length; i+=pageSize)
      resultArray.push(result.splice(i, i+pageSize));
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
router.get("/add_to_cart/:id", (req, res, next)=> {
  //check if cart has an object otherwise pass empty object
  const productID = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  //mysql statement find product by // ID
  let sql ="SELECT * FROM products WHERE id = ? LIMIT 1";
  let query = db.query(sql, productID, (err, result )=>{
      if(err) throw err;
      // console.log(result);
      if(result.length){
        //stringify and parse results using JSON
        var result= JSON.parse(JSON.stringify(result[0]));
        //send items to cart.js
        cart.add(result, productID);
        req.session.cart= cart;
        console.log(req.session.cart);
        res.redirect("/view_cart");
      }
  });
});
router.get('/product_view/:id', (req, res)=>{
  const productID = req.params.id;


  let sql ="SELECT * FROM products WHERE id = ? LIMIT 1";
  let query = db.query(sql, productID, (err, result )=>{
      if(err) throw err;
      // console.log(result);
      if(result.length){
        const data = result;
        console.log(data);
        res.render('product_view',{data: data});

      };
    });

});

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

router.post('/checkout',( req, res)=>{
  if(!req.session.cart){
      return res.redirect('/view_cart');
  }
  console.log(req.body);
  const cart = new Cart(req.session.cart);
  //copied from stripe api
  (async () => {
   const session = await stripe.checkout.sessions.create({
     payment_method_types: ['card'],
     line_items: [{
       name: 'T-shirt',
       description: 'Comfortable cotton t-shirt',
       images: ['https://example.com/t-shirt.png'],
       amount: 500,
       currency: 'usd',
       quantity: 1,
     }],
     success_url: 'http://localhost:3000/',
     cancel_url: 'http://localhost:3000/checkout',
   });
 })();
 console.log(session);
 var stripe = Stripe('PUBLIC KEY');

 stripe.redirectToCheckout({
   // Make the id field from the Checkout Session creation API response
   // available to this file, so you can provide it as parameter here
   // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
   sessionId: '{{CHECKOUT_SESSION_ID}}'
 }).then(function (result) {
   // If `redirectToCheckout` fails due to a browser or network
   // error, display the localized error message to your customer
   // using `result.error.message`.
 });
});

module.exports = router;
