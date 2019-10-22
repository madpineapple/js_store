const express = require('express');
const db = require('../models/User');
const nodemailer = require('nodemailer');

this.insertOrders= function(cart,totalPrice, custID){
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
          order(cart, lastID,totalPrice, custID);
        }
      })

};

function order(cart,lastID,totalPrice, custID){
  let sql2 ='INSERT into order_details(orderId, itemId, product, price, qty) VALUES(?, ?, ?, ?, ?)'
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
         console.log("succesfully updated amnt");
         sendReceipt(cart, lastID,totalPrice, custID);
       }
     })
   }
};

function sendReceipt(cart, lastID,totalPrice, custID){
  let sql =`SELECT customers.name,customers.address, customers.city, customers.country,
customers.zip, orders.totalPrice ,order_details.product FROM customers
INNER JOIN orders ON orders.custID = customers.custID
INNER JOIN order_details ON order_details.orderId=orders.orderId
WHERE customers.custID=?`;

db.query(sql,[custID],(err, result)=>{
  if(err){
    throw err;
  }else{
      var result= JSON.parse(JSON.stringify(result[0]));
    console.log(result);
    const output =`
      <h3>Your order is on route!</h3>
      <p>Your delivery address</p>
      <p>${result.name}</p>
      <p>${result.address}</p>
      <p>${result.city}</p>
      <p>${result.country}</p>
      <p>${result.zip}</p>
      <p>Your order</p>
      <p>${result.product}</p>
      <p>Total</p>
      <p>$.${totalPrice}</p>
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
})

}
