import { AppService } from 'shared/services/app/app.service';
import { Title } from '@angular/platform-browser';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import { first } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';
import { merge } from 'rxjs/operators';

import { AppUser } from './../model/user.model';
import { SnackbarService } from 'shared/services/angular-material/snack-bar.service';


@Injectable()
export class AuthService {
    // get the current user
    user$: Observable<AppUser>;
    currentUser: any = {};


constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore,
    private route: ActivatedRoute, private router: Router,
    private snackbarService: SnackbarService, private appService: AppService ) {
        //check the status of the user
    this.user$ = afAuth.authState
    .switchMap(user => {
        if (user) { // the user is logged In
            return this.afs.doc<AppUser>(`users/${user.uid}`).valueChanges();
        } else {
            // the user is not logged in
            return Observable.of(null);
        }
    });
  }

  // register a new User
  signupUser(firstName: string, lastName: string , email: string , password: string) {
      this.appService.fireloader();
    firebase.auth().createUserWithEmailAndPassword(email, password).then((credential) => {
        if (credential.uid) {
                this.currentUser.uid = credential.uid;
                this.currentUser.email = credential.email;
                this.currentUser.displayName = firstName + ' ' + lastName;
                this.currentUser.photoURL = '';
               this.updateUserData(this.currentUser);
               this.appService.stopLoader();
         this.snackbarService.launch('Registro correcto, iniciando session', 'Alta Usuario', 5000);

        this.router.navigate(['/']);  }
            })

      .catch(
        error => {
            this.snackbarService.launch('Error: ' + error,  'Alta Usuario', 5000);
            this.appService.stopLoader();
        }

      );

  }

//login with email and password
login(email, password): Observable<any> {
    this.appService.fireloader();
    //used for redirecting the user for the page that they wanted to go
    const returnURL = this.route.snapshot.queryParamMap.get('returnUrl' || '/');
    //save the value on the local storage for when the user returns from login
    localStorage.setItem('returnUrl', returnURL);
    this.appService.stopLoader();
    return Observable.fromPromise(this.afAuth.auth.signInWithEmailAndPassword(email, password)

    .catch( error => {
        this.snackbarService.launch('Error: ' + error,  'Inicio de session', 5000);
        this.appService.stopLoader();
    } ));

}





  // login with google
  loginGoogle() {
    this.appService.fireloader();
      const provider = new firebase.auth.GoogleAuthProvider();
      return this.oAuthLogin(provider).catch(error => {
        this.snackbarService.launch('Error: ' + error,  'Inicio de session', 5000);
        this.appService.stopLoader();
    });
        }

// private method for sign in with social networks
 private oAuthLogin(provider) {
return this.afAuth.auth.signInWithPopup(provider).then((credential) => {
    this.updateUserData(credential.user);
     //used for redirecting the user for the page that they wanted to go
     const returnURL = this.route.snapshot.queryParamMap.get('returnUrl' || '/');
     //save the value on the local storage for when the user returns from login
     localStorage.setItem('returnUrl', returnURL);
     this.appService.stopLoader();
  });
 }

 //update the user data in firestore
 private updateUserData(user: AppUser) {
const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
const data: AppUser = {
    uid: user.uid,
    email: user.email,
    photoURL: user.photoURL,
    displayName: user.displayName,
    cartId: localStorage.getItem('cartId'),
    roles:  {
         customer: true,
        // admin: true
    }
   };
   return userRef.set(data, {merge : true});
 }


 isLoggedIn() {
    return this.afAuth.authState.pipe(first()).toPromise();
 }


//logout
logout() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/']);
  }


}
