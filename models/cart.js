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
   // this.totalPrice += storedItem.price;
   // console.log('totalPrice');
   // console.log(this.totalPrice);
 };

  //remove item from Cart
  //price doesnt work though
  this.removeItem = (id)=>{
    this.totalQty-= this.items[id].qty;
    // this.totalPrice -= this.items[id].price;
    delete this.items[id];
  };
  this.generateArray = function(){
    var arr = [];
    for (var id in this.items){
      arr.push(this.items[id]);
    }
    return arr;
  }
  this.totalPrice = function() {
    var arr2 =[]

    for (var id in this.items){
      arr2.push(this.items[id].price);
    }
    console.log('price array')
    console.log(arr2)
    console.log(
   arr2.reduce((a, b) => a + b, 0)
 )
 total=(arr2.reduce((a, b) => a + b, 0));
 return total;
}
};
