import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import { Order } from 'shared/models/orders/order.model';
import { Product } from 'shared/models/products/product.model';

@Injectable()
export class OrderDetails{
    constructor(private db: AngularFirestore){}


      // get the cart for the customer
  myOrders(id) {
    return this.db.doc<Order>(`orders/${id}`).snapshotChanges();
  }

    // to sum all the quantity of all the product that we have on our cart
    totalPrice(products: Product[]): number {
        let total = 0;
        for (let i = 0; i < products.length; i++) {
          total += (parseInt(products[i]['quantity']) * products[i]['price']);
        }
        return total;
      }
}