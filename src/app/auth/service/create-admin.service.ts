import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AppUser } from './../model/user.model';
import { SnackbarService } from 'shared/services/angular-material/snack-bar.service';
// for working with firebase firestore collection
type userCollection = AngularFirestoreCollection<AppUser[]>;
// get the reference for the document id for delete and getById or Update
type userDoc = AngularFirestoreDocument<AppUser>;
@Injectable()
export class CreateAdmin {
    constructor(private db: AngularFirestore, private snackbarService: SnackbarService) { }
    getAllUsers() {

        return this.db.collection<AppUser[]>('users');
    }

    //update the user data in firestore
     updateAdmin(user: AppUser, inputValue: boolean) {
    const userRef: AngularFirestoreDocument<any> = this.db.doc(`users/${user.uid}`);
    const data: AppUser = {
        uid: user.uid,
        email: user.email,
        
       
        
        roles:  {
            //  customer: true,
             admin: inputValue
        }
       };
       this.snackbarService.launch("Roles the administrador actualizado", "Role De usuario", 3000);
       return userRef.set(data, {merge : true});
     }


         //update the user data in firestore
     updateCliente(user: AppUser, inputValue: boolean) {
        const userRef: AngularFirestoreDocument<any> = this.db.doc(`users/${user.uid}`);
        const data: AppUser = {
            uid: user.uid,
            email: user.email,
            roles:  {
                  customer: inputValue               
            }
           };
           this.snackbarService.launch("Roles the cliente actualizado", "Role De usuario", 3000);
           return userRef.set(data, {merge : true});
         }


             //update the user data in firestore
     updateManager(user: AppUser, inputValue: boolean) {
        const userRef: AngularFirestoreDocument<any> = this.db.doc(`users/${user.uid}`);
        const data: AppUser = {
            uid: user.uid,
            email: user.email,

            roles:  {
            
                vendedor: inputValue
            }
           };
           this.snackbarService.launch("Roles the Manager actualizado", "Role De usuario", 3000);
           return userRef.set(data, {merge : true});
         }
    

}

