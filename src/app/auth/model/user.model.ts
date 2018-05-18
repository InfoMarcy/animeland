export interface AppRoles {
    customer?: boolean;
    vendedor?: boolean;
    admin?: boolean;
     }

     export interface AppUser {
        uid: string;
        email: string;
        photoURL?: string;
        displayName?: string;
        cartId?: string;
        roles: AppRoles;
    }
