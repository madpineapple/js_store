const express = require('express');
const router = express.Router();
const Cart = require("./cart");

//User model
const db = require('../models/User');

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

//Cart route, transfer products to cart object might not need
router.get("/add_to_cart/:id", (req, res, next)=> {
  console.log("hellooo");
  //check if cart has an object otherwise pass empty object
  const productID = req.params.id;
  console.log(productID);
  const cart = new Cart(req.session.cart ? req.session.cart : {});

  //mysql statement find product by // ID
  let sql ="SELECT * FROM products WHERE id = ? LIMIT 1";
  let query = db.query(sql, id, (err, result)=>{
      if(err) throw err;
      console.log(result);
      if(result.length){
        cart.add(product, product.id);
        req.session.cart;
        console.log(req.session.cart);
        res.redirect("/");
      }

  });
});

module.exports = router;
