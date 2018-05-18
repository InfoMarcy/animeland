import { Observable } from 'rxjs/Observable';


import { Subscription } from 'rxjs/Subscription';
import { ShoppingCartService } from 'shared/services/product/shopping-cart.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.css']
})
export class CheckOutComponent implements OnInit, OnDestroy {

  //store shipping info
  shipping: any = {};
   //hold the cart values
   cart;
cartSubscription: Subscription;

totalPrice: number;
  constructor(private shoppingCartService: ShoppingCartService ) { }

  // get the shopping carts items
     ngOnInit() {
    this.cartSubscription =  this.shoppingCartService.myCart().subscribe(cart => {
        this.cart = cart.payload.data();
        this.totalPrice = this.shoppingCartService.totalPrice(this.cart.products);
      });

    }

    ngOnDestroy() {
      this.cartSubscription.unsubscribe();
    }
}
