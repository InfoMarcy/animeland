import { Observable } from 'rxjs/Observable';
import { SnackbarService } from 'shared/services/angular-material/snack-bar.service';
import { AppService } from 'shared/services/app/app.service';
import { ShoppingCartService } from 'shared/services/product/shopping-cart.service';
import { Component, OnInit } from '@angular/core';
import { Product } from 'shared/models/products/product.model';
@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.css']
})
export class ShoppingCartComponent implements OnInit {

  cart;
  totalPrice = 0;

  constructor(private shoppingCartService: ShoppingCartService,
    private snackbarService: SnackbarService,
    private appService: AppService) { }
 ngOnInit() {

  this.shoppingCartService.myCart().subscribe(cart => {
    this.cart = cart.payload.data();
    this.totalPrice = this.shoppingCartService.totalPrice(this.cart.products);
  });
}

// update a product on the cart
update(product: Product, event) {
  const qty = event.target.value;

  if (qty <= 0) {
    this.shoppingCartService.removeProduct(product).then(() => {
      this.snackbarService.launch('Producto eliminado', 'Carrito', 4000);

    }).catch(error => {
      this.snackbarService.launch('Error eliminando el producto', 'Carrito', 4000);

    });
    return;
  }
  // this.appService.fireloader();
  this.shoppingCartService.updateProduct(product, qty).then(() => {
    this.snackbarService.launch('Producto Actualizado', 'Carrito', 4000);
    // this.appService.stopLoader();
  }).catch(error => {
    this.snackbarService.launch('Error Actualizando el producto', 'Carrito', 4000);
    // this.appService.stopLoader();
  });
}

// remove a product from  the cart
remove(product: Product) {
  this.shoppingCartService.removeProduct(product).then(() => {
    this.snackbarService.launch('Producto eliminado', 'Carrito', 4000);
  }).catch(error => {
    this.snackbarService.launch('Error eliminando el producto', 'Carrito', 4000);
  });
}


// clear the cart
clearCart() {
  this.shoppingCartService.resetCart();
}

}


