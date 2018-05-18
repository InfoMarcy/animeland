import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ShoppingCartService } from 'shared/services/product/shopping-cart.service';
import { router } from './../../../app.routes';
import { SnackbarService } from 'shared/services/angular-material/snack-bar.service';


@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent implements OnInit {
@Input('product') product;
@Input('show-actions') showActions = true;
@Input('shopping-cart')  shoppingCart;
@Input('cartTotalPrice')  cartTotalPrice;

  constructor(private cartService: ShoppingCartService, private router: Router, private snackbarService: SnackbarService)  { }

  ngOnInit() {
 this.getQuantity();
}




      // // go to the details page
      goToDetails(productId) {
        this.router.navigate(['/product' + '/' + productId]);
      }

      //  // get the quantity of the product in the shopping cart
       getQuantity() {
        if (!this.shoppingCart) { return 0; } // check if there is a shopping cart

        for (const item of this.shoppingCart.products) {
        if (item.id === this.product.id) {
          return item.quantity;
        }
        }

        return 0;

      }

addToCart(){
this.cartService.addToCart(this.product, 1);
}

       // update a product on the cart
update(productQuantity) {

  const qty: number = parseInt(productQuantity);

  if (qty <= 0) {

    this.cartService.removeProduct(this.product).then(() => {
      this.snackbarService.launch('Producto eliminado', 'Carrito', 4000);

    }).catch(error => {
      this.snackbarService.launch('Error eliminando el producto', 'Carrito', 4000);

    });
    return;
  }
  this.cartService.updateProduct(this.product, qty).then(() => {
  this.snackbarService.launch('Producto Actualizado', 'Carrito', 4000);
    // this.appService.stopLoader();
  }).catch(error => {
    this.snackbarService.launch('Error Actualizando el producto', 'Carrito', 4000);
    // this.appService.stopLoader();
  });

}

    }
















