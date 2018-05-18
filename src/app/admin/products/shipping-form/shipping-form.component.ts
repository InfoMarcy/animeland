import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { AuthService } from '../../../auth/service/auth.service';
import { OrderService } from 'shared/services/checkout/order.service';
import { ShoppingCartService } from 'shared/services/product/shopping-cart.service';
import { SnackbarService } from 'shared/services/angular-material/snack-bar.service';

@Component({
  selector: 'app-shipping-form',
  templateUrl: './shipping-form.component.html',
  styleUrls: ['./shipping-form.component.css']
})
export class ShippingFormComponent implements OnInit, OnDestroy {
  //store shipping info
  shipping: any = {};
   // get the id of the current user
 userId: string;
 userSubscription: Subscription;
@Input('cart') cart;
@Input('totalPrice') totalPrice;
  constructor( private  orderService: OrderService,
   private authService: AuthService,
   private cartService: ShoppingCartService,
   private snackbarService: SnackbarService) { }

  ngOnInit() {
    this.userSubscription =   this.authService.user$.subscribe(user => this.userId = user.uid);
  }
      // place the order
       placeOrder(shipping) {
         const order = {
           id: null,
           uid: this.userId,
           products: this.cart.products,
           amount: this.totalPrice,
           totalProducts: this.cart.totalProducts,
           shipping,
           created_at: new Date().getTime()
         };
this.orderService.placeOrder(order).then(() => {
this.cartService.resetCart().then(() => {
this.snackbarService.launch('Pedido creado exitosamente', 'Carrito', 6000);

});
});

      }
  // unsubscribe
  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}
