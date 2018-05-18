import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { PaymentService } from 'stripe/services/payment.service';

@Component({
  moduleId: module.id,
  selector: 'app-make-payment',
  templateUrl: './make-payment.component.html',
  styleUrls: ['./make-payment.component.css']

})
export class MakePaymentComponent  {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvc: string;
  message: string;
  card: any;
  amount: number = 500;
  token;

  // Same properties declaration

  constructor(private _zone: NgZone, private paymentService: PaymentService) {    }


  getToken() {
    this.message = 'Loading...';

    (<any>window).Stripe.card.createToken({
      number: this.cardNumber,
      exp_month: this.expiryMonth,
      exp_year: this.expiryYear,
      cvc: this.cvc
    }, (status: number, response: any) => {

      // Wrapping inside the Angular zone
      this._zone.run(() => {
        if (status === 200) {
          // this.message = `Success! Card token ${response.card.id}.`;

          (<any>window).Stripe.customers.create({
            email: "MarcyGarcia@outlook.com",
            card: response.card.id
          })


          // this.charge(this.amount,"MXN", response.card.id);
          this.paymentService.processPayment(response.card.id, this.amount);
        } else {
          this.message = response.error.message;
        }
      });
    });
  }

  charge(amount, currency, stripeToken){
  const charge = {amount, currency, stripeToken};
  (<any>window).Stripe.customers.create({
    email: "MarcyGarcia@outlook.com",
    card: stripeToken
  })
  .then(customer =>
    (<any>window).Stripe.charges.create({
      amount,
      description: "Sample Charge",
      currency: "usd",
      customer: customer.id
    }));
    // Stripe.card.charges.create(charge);
  }

  
 
 

}

