import { Observable } from 'rxjs/Observable';
import { AppUser } from './../../auth/model/user.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/service/auth.service';
import { ShoppingCartService } from 'shared/services/product/shopping-cart.service';
import { fadeInItems } from '@angular/material';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  appUser: AppUser;
  cart: any;

  constructor(private auth: AuthService,
    private shoppingCartService: ShoppingCartService,
    private router: Router) { }


  //logout of the app
  logout() {
    this.auth.logout();
  }

  ngOnInit() {
    // check if there is a user loggedin
    this.auth.user$.subscribe(appUser => { this.appUser = appUser; });

    // get the reference of the cart
    const cartRef = this.shoppingCartService.myCartRef().get();
    // verify if the cart exist
    cartRef.then((cart) => {
      if (cart.exists) { // cart exist
        this.shoppingCartService.myCart().subscribe(myCart => { // get the values from the cart
          this.cart = myCart.payload.data();
        });
      } else {// cart does not exist
        this.shoppingCartService.createCart();
        this.shoppingCartService.myCart().subscribe(myCart => { // get the values from the cart
          this.cart = myCart.payload.data();
        });

      }
    });


  }








}
