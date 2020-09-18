import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { ServiceService } from '../services/services.service'
@Component({
  selector: 'app-getotp',
  templateUrl: './getotp.component.html',
  styleUrls: ['./getotp.component.css']
})
export class GetotpComponent implements OnInit {
  signupForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  data2 : any;
  path : any;
  otpType: string;
  phone: string;
  phone1: any;
  message:any;
  isAlet=false;

   constructor(private formBuilder: FormBuilder , private serviceService : ServiceService  ,private http: HttpClient,private route: ActivatedRoute, private router: Router ) { }

  ngOnInit(): void {
    let f = localStorage.getItem('user');
    console.log(f)
     this.signupForm= this.formBuilder.group({
      //inputotp: ['', Validators.required],
      inputotp: ['', [ Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(4), Validators.maxLength(4)]],
      // inputotp : ['', [Validators.required, ],
    });

    this.phone = localStorage.getItem('phone')
     this.phone1 =  this.phone.replace(/\d(?=\d{4})/g, "X");

  }
  get f() { return this.signupForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.  signupForm.invalid) {
     return;
 }
      const inputotp = this.signupForm.value.inputotp;
     this.phone = localStorage.getItem('phone');
      const otptype = localStorage.getItem('otptype');



        const payload = {
          mobileNumber: this.phone,
          otp: inputotp,
          otpType: otptype

        }
        localStorage.getItem('phone');

        // alert(JSON.stringify(payload))
        this.serviceService.login(payload).subscribe(
               data => {
                 console.log(data)
                 this.data2 = data;

            //console.log(JSON.stringify(this.data2));

            if(this.data2.token)
               ///localStorage.removeItem('user')
              // localStorage.setItem('phone', JSON.stringify(this.data2.response))
                //  localStorage.getItem('phone');
                //localStorage.setItem('user', JSON.stringify(this.data2.response))

                this.router.navigate(['../home/neworders']);

          //  localStorage.removeItem('phone');
          //       localStorage.removeItem('otptype');



            },err => {
              console.log(err)


            }

         )
      }
  payload(_payload: any): any {
    throw new Error("Method not implemented.");
  }
  reSend(){
    let send = localStorage.getItem('phone')
     this.serviceService.resendOtp(send).subscribe(
       data => {

         this.data2 = data;
      // alert(JSON.stringify(this.data2));

    },err => {
      console.log(err)
    }
     )
   }
}
