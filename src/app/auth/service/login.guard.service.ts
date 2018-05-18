import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/take';
import { Injectable } from '@angular/core';
import { CanActivate, Router, RouterStateSnapshot, ActivatedRouteSnapshot } from '@angular/router';

import { AuthService } from './auth.service';

@Injectable()
export class LoginGuardService implements CanActivate {

   constructor(private auth: AuthService, private router: Router) {}


    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        const user =  this.auth.isLoggedIn();
        if (user) { return true; }
        return false;
    }



}
