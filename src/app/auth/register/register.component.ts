import { SnackbarService } from 'shared/services/angular-material/snack-bar.service';
import { Title } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../service/auth.service';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user;
  constructor(private auth: AuthService,  private title: Title

            ) { }

  ngOnInit() {
    this.title.setTitle('registro en la tienda');
  }
  onSignUp(form: NgForm) {
    const firstName = form.value.firstName;
    const lastName = form.value.lastName;
    const email = form.value.email;
    const password = form.value.password;
this.auth.signupUser(firstName, lastName, email, password);
  }
}
