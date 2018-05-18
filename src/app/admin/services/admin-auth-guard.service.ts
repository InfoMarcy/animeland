import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../../auth/service/auth.service';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { tap, map, take} from 'rxjs/operators';

@Injectable()
 export class AdminAuthGuard  implements CanActivate {

    constructor(private auth: AuthService, private router: Router) {}


    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
       return this.auth.user$.pipe(
           take(1),
           map(user => user && user.roles.admin ? true : false),
            tap(isAdmin => {
                if (!isAdmin) {
                    console.error('access denied -admins only');
                    alert('access denied -admins only: redirecting to home Page');
                    this.router.navigate(['/']);
                }
            })
       );
      }
}
