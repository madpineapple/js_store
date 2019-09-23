//User model
const db = require('../models/User');
//cart constructor
module.exports = function Cart(oldCart){
  this.items= oldCart.items || {};
  this.totalQty = oldCart.totalQty ||0;
  // this.totalPrice = oldCart.totalPrice || 0;

//add new item to cart
  this.add = function(item, id){
  //check if item exists in cart
   var storedItem = this.items[id];

   if(!storedItem){
     storedItem = this.items[id]={item: item, qty: 0, price:0};
   }
   storedItem.qty++; //increase quantity by one
   storedItem.price = storedItem.item.price * storedItem.qty;
   console.log('storedItem.price');
   console.log(storedItem.price);
   this.totalQty++;

 };

  //remove item from Cart
  this.removeItem = (id)=>{
    this.totalQty-= this.items[id].qty;
    delete this.items[id];
  };

  this.generateArray = function(){
    var arr = [];
    for (var id in this.items){
      arr.push(this.items[id]);
    }
    return arr;
  }

  //find totalPrice
  this.totalPrice = function() {
 //create an array of prices
    var arr2 =[]
    for (var id in this.items){
      arr2.push(this.items[id].price);
    }
 //add the prices to create a total price
 total=(arr2.reduce((a, b) => a + b, 0));
 return total;
}

//creat an array of ids
this.idArray= function(){
  var arr =[]
  for (var id in this.items){
    arr.push(id);
  }
  return arr;
}
//create an arry of qty
//creat an array of ids
this.qtyArray= function(){
  var arr =[]
  for (var id in this.items){
    arr.push(this.items[id].qty);
  }
  return arr;
}
};
