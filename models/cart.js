
//cart constructor MIGHT NOT NEED
module.exports = function Cart(oldCart){
  this.items= oldCart.items || {};
  this.totalQty= oldCart.totalQty ||0;
  this.totalPrice=oldCart.totalPrice || 0;

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
    this.totalPrice += storedItem.item.price;
  }
  this.generateArray = function(){
    const arr = [];
    for (const id in this.items){
      arr.push(this.items[id]);
    }
    return arr;
  }
};
