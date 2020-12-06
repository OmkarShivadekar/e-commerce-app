import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new Subject<number>();
  totalQuantity: Subject<number> = new Subject<number>();
  
  constructor() { }

  addToCart(theCartItem: CartItem){

    //check if we already have the item in our cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if(this.cartItems.length > 0){
      
      //find the item in the cart based on item id
      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);
      
      // for(let tempcartItem of this.cartItems){
      //   if(tempcartItem.id === theCartItem.id){
      //     existingCartItem = tempcartItem;
      //     break;
      //   }
      // }

      //check if we found it 
      alreadyExistsInCart = (existingCartItem != undefined);

    }

    if(alreadyExistsInCart){
      //increment the quantity
      existingCartItem.quantity++; 
    }
    else{
      //just add the item to the array
      this.cartItems.push(theCartItem);
    }

    //compute cart total price and quantity
    this.computeCartTotal(); 
    
  }

  computeCartTotal() {
    
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for(let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    } 

    //publish the new value ... all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    //log cart data
    this.logcartData(totalPriceValue, totalQuantityValue);
  }

  logcartData(totalPriceValue: number, totalQuantityValue: number) {
    
    console.log('Contents of the cart');
    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(`name=${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subtotalPrice=${subTotalPrice}`);
    }

    console.log(`totalPrice=${totalPriceValue.toFixed(2)}, totalQuantity=${totalQuantityValue}`);
    console.log('-----------');
  }
}
