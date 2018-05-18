import { ShoppingCartService } from 'shared/services/product/shopping-cart.service';
import { Router } from '@angular/router';
import { AuthService } from './auth/service/auth.service';
import { Component } from '@angular/core';
import { AppService } from 'shared/services/app/app.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private auth: AuthService, router: Router, public appService: AppService,
    private shoppingCartService: ShoppingCartService) {

    auth.user$.subscribe(user => {
      //check if there is a user logged in
      if (!user) { return; }

    //get the return url from localStorage
        const returnUrl = localStorage.getItem('returnUrl');
        if (!returnUrl) { return; }
        //remove the url from localStorage
        localStorage.removeItem('returnUrl');
        //redirect the user to the previous url
        router.navigateByUrl(returnUrl);

    });
  }
}
