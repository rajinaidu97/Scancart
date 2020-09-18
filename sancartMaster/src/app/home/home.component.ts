import { Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { ActivatedRoute, Router } from "@angular/router";
import { ServiceService } from "../services/services.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  loginForm: FormGroup;
  // loginForm: any;
  // formBuilder: any;
  submitted: boolean;
  loading: true;
  form: any;
  input: any;
  data3: Object;
  data: Object;
  user: any;
  logoutForm: any;
  currentOrderDetail: Object;
  userName: string;
  response: Object;
  // subscription: any;
  getfoodMenu: any;
  userList: any = [{}];
  toggle = true;
  // status = "Enable";
  userForm: any;
  timeout: any = null;
  isNewOrders: boolean = true;
  searchEnabled: boolean = false;

  @Input() searchText: string = "";
  @Input() searchData: any = [];

  @ViewChild("myModel") myModel: ElementRef;
  userData: any;
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private serviceService: ServiceService
  ) {}

  ngOnInit(): void {
    this.userForm = this.formBuilder.group({
      phone: [
        "",
        [
          Validators.required,
          Validators.pattern(/^[6-9]\d{9}$/),
          Validators.minLength(10),
          Validators.maxLength(10),
        ],
      ],
      name: ["", Validators.required],
    });
    // this.globaleSaerch();
  }

  get f() {
    return this.userForm.controls;
  }

  onSubmit() {
    // console.log(model.dismiss);

    this.submitted = true;
    // stop here if form is invalid
    if (this.userForm.valid) {
      this.myModel.nativeElement.click();

      this.router.navigate(["/home/barcode"]);
      return;
    }
  }

  logout() {
    this.submitted = true;
    console.log("logoutworking");
    // this.user = localStorage.getItem("user");
    // let user1 = JSON.parse(this.user);
    this.userData = JSON.parse(localStorage.getItem("user"));

    this.serviceService
      .Logout(this.userData.merchantId, this.userData.token)
      .subscribe((data) => {
        this.data3 = data;
        console.log(JSON.stringify(this.data3));

        this.router.navigate(["../login"]);
        localStorage.removeItem("user");
        localStorage.removeItem("phone");
        localStorage.removeItem("otptype");

        console.log("done");
      });
  }

  globaleSaerch = ($event) => {
    if (this.searchText.length > 1) {
      this.searchEnabled = true;
    }
    if (this.router.url == "/home/neworders") {
      this.isNewOrders = true;
    } else if (this.router.url == "/home/pastorders") {
      this.isNewOrders = false;
    }
    if (this.searchText.length >= 2) {
      if (this.isNewOrders) {
        // New Orders API
        this.serviceService
          .searchForCards(this.searchText)
          .subscribe((data) => {
            if (data.response.data) {
              this.searchData = data.response.data;
              // this.listData = [];
            }
            // this.searchData = data.response.data;
          });
      } else if (!this.isNewOrders) {
        // Past Orders API
        this.serviceService
          .searchForCardsPast(this.searchText)
          .subscribe((data) => {
            if (data.response.data) {
              this.searchData = data.response.data;
              // this.listData = [];
            }
            // this.searchData = data.response.data;
          });
      }
    } else {
      this.searchData = [];
    }

    // let url = window.location.href.split("/").pop();
    // console.log(url);
    //   if ((url = "neworders")) {
    //            this.curentOrderSearch();
    //   } else {
    //           this.pastOrderSearch();
    //   }
  };

  // pastOrderSearch = () => {
  //   if (this.searchText.length === 2 && this.searchText.length > 2) {
  //     this.serviceService
  //       .searchForCardsPast(this.searchText)
  //       .subscribe((data) => {
  //         if (data.response.data) {
  //           console.log(data.response.data);
  //           this.searchData = data.response.data;
  //           // this.listData = [];
  //         }
  //         // this.searchData = data.response.data;
  //       });
  //   } else {
  //     this.searchData = null;
  //   }
  // };

  // curentOrderSearch = () => {
  //   if (this.searchText.length === 2 && this.searchText.length > 2) {
  //     this.serviceService.searchForCards(this.searchText).subscribe((data) => {
  //       if (data.response.data) {
  //         console.log(data.response.data);
  //         this.searchData = data.response.data;
  //         // this.listData = [];
  //       }
  //       // this.searchData = data.response.data;
  //     });
  //   } else {
  //     this.searchData = null;
  //   }
  // };

  onKeySearch(event: any) {
    clearTimeout(this.timeout);
    var $this = this;
    this.timeout = setTimeout(function () {
      if (event.keyCode != 13) {
        $this.executeListing(event.target.value);
      }
    }, 2000);
  }

  executeListing(value: string) {
    if (value.length == 10) {
      let obj = {};
      obj["phone"] = value;
      this.serviceService.loginApiUser(obj).subscribe((data) => {
        localStorage.setItem(
          "user id",
          JSON.stringify(data["response"].userId)
        );
        this.router.navigate(["../home/barcode"]);
        if (data["response"].message == "User Not Existed.") {
          this.serviceService.registerApiUer(obj).subscribe((data1) => {
            localStorage.setItem(
              "user id",
              JSON.stringify(data1["response"].userId)
            );
            this.router.navigate(["../home/barcode"]);
          });
        }
      });
    }
  }

  resetSearch() {
    this.searchEnabled = false;
    this.searchData = [];
    this.searchText = "";
  }
}
