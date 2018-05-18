import { AppUser } from './../../auth/model/user.model';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from './../../auth/service/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.component.html',
  styleUrls: ['./order-success.component.css']
})
export class OrderSuccessComponent implements OnInit {

  appUser:AppUser;
  orderId;
  constructor(private auth: AuthService, private route: ActivatedRoute) { }

  ngOnInit() {
   // check if there is a user loggedin
   this.auth.user$.subscribe(appUser => { this.appUser = appUser; });

   // read the id parameter from the route link
   this.orderId = this.route.snapshot.paramMap.get('id');

  }

}
