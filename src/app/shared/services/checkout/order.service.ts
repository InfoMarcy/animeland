import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as faker from 'faker';

import { Order } from 'shared/models/orders/order.model';
import { AuthService } from 'auth/service/auth.service';
import { ShoppingCartService } from './../product/shopping-cart.service';

type ordersCollections = AngularFirestoreCollection<Order[]>;
type ordersDoc = AngularFirestoreDocument<Order>;
@Injectable()
export class OrderService {
    constructor(private db: AngularFirestore,
                private shoppingCartService: ShoppingCartService,
                private auth: AuthService,
                private router: Router) {

    }


    // get the list of all the orders
    getOrders(): ordersCollections {
        return this.db.collection<Order[]>(`orders`);
    }
    // get the list of  orders by userId
    getOrderByUserId(userId): ordersCollections {
        if (userId) {
            return this.db.collection<Order[]>(`orders`, ref => ref.where('uid', '==', userId));
        }
    }

    // get an order by id
    getOrderById(id: string) {
   return this.db.doc<Order>(`orders/${id}`);
    }


    // place an order
     placeOrder(order: Order): Promise<any> {
    const id = faker.random.alphaNumeric(16);
    order.id = id;

    return this.getOrders().doc(id).set(Object.assign({}, order)).then(() => {
        this.router.navigate(['/orden-completada', id]);
    });
    }

}
