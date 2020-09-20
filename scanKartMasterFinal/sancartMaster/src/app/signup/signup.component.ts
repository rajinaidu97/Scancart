import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {ServiceService} from '../services/services.service';
import * as AOS from 'aos';
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  returnUrl: string;
  UserDetails = { name: '', email: '', phone: 0 }
  authenticationService: any;
  // MerchantsinupService: any;
  loginService: any;


  constructor(private http: HttpClient, private formBuilder: FormBuilder,
    public router: Router, private route: ActivatedRoute, private ServiceService: ServiceService,) { }

  ngOnInit(): void {
    AOS.init();
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required,Validators.pattern('^[a-zA-Z]*$')]],
      phone: ['', [ Validators.required, Validators.pattern(/^[6-9]\d{9}$/), Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email,Validators.pattern('^[A-Za-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      // this.isValidFormSubmitted : false,

  }, );
}

  // convenience getter for easy access to form fields
 get f() { return this.registerForm.controls; }
 phone = localStorage.getItem('phone');


onSubmit() {

    this.submitted = true;
      // stop here if form is invalid
      if (this.registerForm.invalid) {
       return;
   }
    this.ServiceService.createMerchantsinup(this.registerForm.value)
   .subscribe(data => {
     localStorage.setItem('phone', this.registerForm.value.phone);
     localStorage.setItem('otptype', "SIGNUP");
     const result: any = data;
     // alert(JSON.stringify(result))

    this.router.navigate(['../getotp'], { relativeTo: this.route });

     if(result.response.message =='User Already Existed with same email.')
     {
       return this.router.navigate(['../signup'])


   }
 }
   )}

}
