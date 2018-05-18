import { AppUser } from './../model/user.model';
import { User } from 'firebase/app';


export class RoleService {

    // roles allowd to users
    canRead(user: AppUser): boolean {
        const allowed = ['admin', 'customer', 'vendedor' ];
        return this.checkAuthorization(user, allowed);

    }
  // roles allowd to users
    canEdit(user: AppUser): boolean {
        const allowed = ['admin', 'vendedor' ];
        return this.checkAuthorization(user, allowed);

    }
  // roles allowd to users
    canDelete(user: AppUser): boolean {
        const allowed = ['admin'];
        return this.checkAuthorization(user, allowed);

    }

 // determine if user has matching role
private checkAuthorization(user: AppUser, allowedRoles: string[]): boolean {
if (!user) { return false; }
for (const role of allowedRoles) {
    if (user.roles[role]) {
        return true;
    }
}
return false;
}

}
