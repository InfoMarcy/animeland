import { OrderDetails } from 'shared/services/order-details/order-details.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'auth/service/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.css']
})
export class OrderDetailsComponent implements OnInit {
  appUser;
  orderId;
  order;
  totalPrice = 0;
  constructor(private auth: AuthService, private route: ActivatedRoute, private orderDetails :OrderDetails) { }

  ngOnInit() {
     // check if there is a user loggedin
     this.auth.user$.subscribe(appUser => { this.appUser = appUser; });

     // read the id parameter from the route link
     this.orderId = this.route.snapshot.paramMap.get('id');

   if(this.orderId != null){
    this.orderDetails.myOrders(this.orderId).subscribe(myOrders => {
     this.order = myOrders.payload.data();
     this.totalPrice = this.orderDetails.totalPrice(this.order.products);
    });
   }
   
  }

}
