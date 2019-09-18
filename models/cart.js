//User model
const db = require('../models/User');
//cart constructor
module.exports = function Cart(oldCart){
  this.items= oldCart.items || {};
  this.totalQty = oldCart.totalQty ||0;
  this.totalPrice = oldCart.totalPrice || 0;

//add new item to cart
  this.add = function(item, id){
  //check if item exists in cart
   var storedItem = this.items[id];

   if(!storedItem){
     storedItem = this.items[id]={item: item, qty: 0, price:0};
   }
   storedItem.qty++; //increase quantity by one
   storedItem.price = storedItem.item.price * storedItem.qty;
   this.totalQty++;
   this.totalPrice += storedItem.price;
 };

  //remove item from Cart
  this.delete = (id)=>{
    this.totalQty-= this.items[id].qty;
    this.totalPrice -= this.items[id].item.price;
    delete this.items[id];
  };
  this.generateArray = function(){
    var arr = [];
    for (var id in this.items){
      arr.push(this.items[id]);
    }
    return arr;
  }
};
