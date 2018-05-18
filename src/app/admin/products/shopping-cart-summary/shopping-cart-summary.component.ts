import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-shopping-cart-summary',
  templateUrl: './shopping-cart-summary.component.html',
  styleUrls: ['./shopping-cart-summary.component.css']
})
export class ShoppingCartSummaryComponent implements OnInit {

 @Input('cart') cart;
 @Input('totalItemsCount') totalItemsCount;
 @Input('totalPrice') totalPrice;

ngOnInit() {
this.cart;
this.totalItemsCount;
this.totalPrice;
}

}
