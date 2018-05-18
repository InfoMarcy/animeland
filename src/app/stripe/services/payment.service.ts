import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AuthService } from 'auth/service/auth.service';

@Injectable()
export class PaymentService {


// variable to hold the user id
userId: string;

constructor(private db: AngularFirestore, private auth: AuthService) { 
  // verify that the user is logged in
  auth.user$.subscribe(user => {
    //check if there is a user logged in
    if (!user) {return} 
    else { this.userId = user.uid}; });
}

// process the payment
// this will save the token to firebase, trigetting the cloud function
processPayment(token: any, amount){
const payment = {token, amount};
return this.db.collection('users').doc(this.userId).collection('payments').add(payment);
}

}
