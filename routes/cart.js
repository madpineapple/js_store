module.exports = function Cart(initItem){
  this.items= initItem;
  this.totalQty= 0;
  this.totalPrice=0;

  this.add = function(item, id){
    const storedItem = this.item(id);
    if(!storedItem){
      storedItem = this.item.[id]={};
    }
  }
};
