require('dotenv').config();
const express = require('express');
const router = express.Router();
const {ensureAuthenticated} = require('../config/auth');
const Cart = require("../models/cart");
const keyPublishable = '';
const keySecret = '';
const stripe = require('stripe')('');
const nodemailer = require('nodemailer');

//User model
const db = require('../models/User');

router.get('/',(req, res)=>res.render('welcome',));


router.get('/dashboard',ensureAuthenticated,(req, res)=>
res.render('dashboard',{
name: req.user.user
}));

//products routes

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
		  currentPage: currentPage,

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
  //fetch total price
  totalPrice=cart.totalPrice();
  res.render('view_cart', {products: cart.generateArray(), totalPrice: totalPrice});
});

//Delete an item from the Cart
router.get('/delete_item/:id', (req,res)=>{
  const productId = req.params.id;
  const cart = new Cart(req.session.cart ? req.session.cart: {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/view_cart');
});

//checkout route
router.get('/checkout',(req,res)=>{
  //check to see if a shopping cart exists
    if(!req.session.cart){
        return res.redirect('/view_cart');
    }

    const cart = new Cart(req.session.cart);
    //fetch total price
    totalPrice=cart.totalPrice();
    const errMsg = req.flash('error')[0];
    return res.render('checkout',{total: totalPrice, errMsg: errMsg,
      noErrors: !errMsg,});
  });

router.post('/checkout',( req, res)=>{
  if(!req.session.cart){
      return res.redirect('/view_cart');
  }
  console.log(req.body);
  const{name, address, city, country, zip, email} = req.body;
  let errors = [];

  //Check required fields
  if(!name || !address || !city || !country|| !zip|| !email){
    console.log('error!')
    // errors.push({ msg : "Please fill in all fields"});
  }else{

    const cart = new Cart(req.session.cart);
    //find total price
    totalPrice=cart.totalPrice();
      const errMsg = req.flash('error')[0];
  return res.render('checkout2',{name:name,address:address, city:city,
    country:country, zip:zip, email:email,
     total: totalPrice, errMsg: errMsg, noErrors: !errMsg,
      products: cart.generateArray(),keyPublishable:keyPublishable})
}});
//checkout2 route
router.get('/checkout2',(req,res)=>{
  //check to see if a shopping cart exists
    if(!req.session.cart){
        return res.redirect('/view_cart');
    }
    const cart = new Cart(req.session.cart);
    //fetch total price
    totalPrice=cart.totalPrice();
    const errMsg = req.flash('error')[0];
  });

  //checkout2 post route
  router.post('/checkout2',( req, res)=>{
    if(!req.session.cart){
        return res.redirect('/view_cart');
    }

    const cart = new Cart(req.session.cart);
    //find total price
    totalPrice=cart.totalPrice();
    let amount = totalPrice *100;
    // console.log(name,  address, city, country, zip, email);
    const{name,  address, city, country, zip, email} =req.body;
    let customers = [name,  address, city, country, zip, email]
    let sql = "INSERT INTO customers (name,  address, city, country, zip, email) VALUES (?, ?, ?,?,?,?);"
 db.query(sql, customers, (err, result)=>{
     if (err){
       throw err;
     }else{
     console.log('succesfully insetred customers');
     console.log(result.insertId);
     let custID = result.insertId;
     insertOrders(cart,totalPrice, custID);
     const output =`
       <h3>Your order is on route!</h3>
       <p>Your delivery address</p>
       <p>${customers}</p>
       <p>Total</p>
       <p>${totalPrice}</p>
     `;
     async function main() {
         // Generate test SMTP service account from ethereal.email
         // Only needed if you don't have a real mail account for testing
         let testAccount = await nodemailer.createTestAccount();

         // create reusable transporter object using the default SMTP transport
         let transporter = nodemailer.createTransport({
             host: 'smtp.ethereal.email',
             port: 587,
             secure: false, // true for 465, false for other ports
             auth: {
                 user: testAccount.user, // generated ethereal user
                 pass: testAccount.pass // generated ethereal password
             }
         });

         // send mail with defined transport object
         let info = await transporter.sendMail({
             from: '"Fred Foo 👻" <foo@example.com>', // sender address
             to: 'bar@example.com, baz@example.com', // list of receivers
             subject: 'Hello ✔', // Subject line
             text: 'Hello world?', // plain text body
             html: output  // html body

         });

         console.log('Message sent: %s', info.messageId);
         // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

         // Preview only available when sending through an Ethereal account
         console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
         // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
     }

     main().catch(console.error);
   }
 });


  //process payment
  //copied from stripe api
    stripe.customers.create({
      email:req.body.stripeEmail ,
      source:req.body.stripeToken
    })
    .then(customer =>
      stripe.charges.create({
        amount,
        description: "Sample Charge",
           currency: "usd",
           customer: customer.id
      }))
      .then(req.session.cart = null)
    .then(charge => res.render("success"));

  });


router.get('/success',(req, res)=>res.render('success'));



function insertOrders(cart,totalPrice, custID){
  //sql commands
  let sql ="INSERT INTO orders(dateCreated, totalPrice, totalQty, custID) VALUES(?, ?, ?, ?)"
  //get date
  var today= new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd<10) {
      dd = '0'+dd
  }

  if(mm<10) {
      mm = '0'+mm
  }

  today = yyyy+ '-' + mm + '-' + dd;
  console.log(today);
  //queries
    db.query(sql,[today, totalPrice, cart.totalQty, custID], (err, result)=>{
        if (err){
          throw err;
        }else{
          let message="succesfully updated orders";
          console.log(message);
          console.log(result.insertId);
          lastID=result.insertId
          order(cart, lastID);
        }
      })

};

function order(cart,lastID){
  let sql2 ='INSERT into order_details(orderId, itemId, name, price, qty) VALUES(?, ?, ?, ?, ?)'
 let stuff= cart.generateArray();
  for(var i=0; i<stuff.length; i++){
    db.query(sql2,[lastID,stuff[i].item.id, stuff[i].item.name,
      stuff[i].price, stuff[i].qty], err=>{
        if (err){
          throw err;
        }else{
          let message="succesfully updated order_details";
          console.log(message);
          return message;
        }
      })
  }
  //create an array for ids and amnt
  let idArr =cart.idArray();
  let amtArr=cart.amntArray();

  //update amnt in database for purchased items
   let sql3=`UPDATE products SET ? WHERE id = ?`;
   for(i= 0; i<idArr.length; i++){
     let query= db.query(sql3,[{amnt: amtArr[i]},idArr[i]], err=>{
       if (err){
         throw err;
       }else{
         console.log("succesfully updated amnt")
       }
     })
   }
};


module.exports = router;
