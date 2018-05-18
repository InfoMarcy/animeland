
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../service/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  //reactive form
  public loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, public auth: AuthService, private router: Router) {
    this.loginForm = this.formBuilder.group({
   email: ['', Validators.required],
   password: ['', Validators.required]
 });

    }

    //login  with email and password
 login() {
 const inputValue = this.loginForm.value;
 this.auth.login(inputValue.email, inputValue.password)
 .subscribe();
 }

  ngOnInit() {
  }
  goToStore() {
this.router.navigate(['/']);
  }
}
