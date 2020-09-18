import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  AfterViewInit,
  OnChanges,
  HostListener,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { ServiceService } from "../../services/services.service";
import { HttpClient } from "@angular/common/http";
import { Pipe, PipeTransform } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import * as AOS from "aos";
import { NgxSpinnerService } from "ngx-spinner";
import { FormGroup, FormArray, FormControl } from "@angular/forms";
import { InfiniteScrollModule } from "ngx-infinite-scroll";

@Component({
  selector: "app-neworders",
  templateUrl: "./neworders.component.html",
  styleUrls: ["./neworders.component.css"],
})
export class NewordersComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() listData = [];
  @Input() isSearchEnabled: boolean = false;

  @ViewChild("containerDOM", { read: ElementRef }) containerDOM: ElementRef;

  direction: string = "";
  data: any;
  updateObject = {};
  listofOrderAttr: [];
  listOfItems: [];
  updateItemArray = [];
  //router: any;
  irection: string;
  sum = 100;
  totalPrice;
  clickCount = 0;
  // pageNumber = 0;
  throttle = 300;
  scrollDistance = 2;
  count = 0;
  limitCount = 0;
  remainingCount: number = 0;
  previousLimitCount: number = 0;
  totalDataCounttoScroll = 0;
  scrollUpDistance = 1.5;
  // direction = "";
  somenewarray;
  paramIndex;
  quantity: any;
  userData;
  // data : any;

  //add barcode
  barcodeNumber: number;
  responseData;
  // totalPrice;
  barCodeResposeData = [];
  checkIndexno;
  indexId;
  userForm: any;
  openAddBarForm = false;
  sendingOrderID: any;
  sendingUserId: any;

  constructor(
    private serviceService: ServiceService,
    private http: HttpClient,
    private _Activatedroute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}
  ngOnInit() {
    AOS.init();
    // console.log(JSON.parse(localStorage.getItem("user")));
    this.userData = JSON.parse(localStorage.getItem("user"));
    // console.log(this.userData);
    setTimeout(() => {
      if (this.listData.length === 0 && !this.isSearchEnabled) {
        this.getAllCards(this.limitCount);
      }
    });
  }

  ngAfterViewInit() {}
  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);
    if (changes.listData) {
      // console.log("searhed");
    } else {
      // console.log("new orders ddddd");
    }
  }

  getAllCards(limitCount: number) {
    // console.log(this.listData.length);
    // console.log(this.userData.merchantId);
    let url = `https://scankart.in:8443/sckart-search/getOrdersByMerchant/${this.userData.merchantId}/CURRENT/${limitCount}`;
    this.serviceService.currentOrder(url).subscribe((data) => {
      this.totalDataCounttoScroll = data.response.totalCount;
      this.limitCount = data.response.limit;
      this.remainingCount = data.response.totalCount;
      if (this.direction == "") {
        this.listData = data.response.data;
      }
      if (data.response.data.length > 0) {
        if (this.direction == "up") {
          this.listData = [];
          this.listData = data.response.data;
        } else if (this.direction == "down") {
          this.listData = [];
          this.listData = data.response.data;
        }
      }
    });
  }

  debounce = (func, duration) => {
    let timeout;
    return function (...args) {
      const effect = () => {
        timeout = null;
        return func.apply(this, args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(effect, duration);
    };
  };

  onScrollDown = () => {
    console.log("DOWN");
    this.direction = "down";
    if (this.limitCount > 0 && this.limitCount < this.totalDataCounttoScroll) {
      //condition to stop scroll
      this.previousLimitCount = this.limitCount - 5;
      console.log("previousLimitCount " + this.previousLimitCount);
      this.getAllCards(this.limitCount);
    }
  };

  onScrollUp() {
    console.log("UP");
    this.direction = "up";
    console.log("previousLimitCount ******* " + this.previousLimitCount);
    console.log("scrollup====>", this.previousLimitCount);
    this.previousLimitCount =
      this.previousLimitCount < 0 ? 0 : this.previousLimitCount;
    this.getAllCards(this.previousLimitCount);
  }

  showCardprice(orderId, userId, data) {
    this.barCodeResposeData = data;
    this.sendingOrderID = orderId; /// create new vaibale
    this.sendingUserId = userId; // /// create new vaibale
    this.totalPrice = data.reduce((a, b) => {
      return a + parseInt(b.price);
    }, 0);
  }
  //cart edit

  addQuantity(data, index) {
    // console.log(data);
    // console.log(index);
    let price = parseFloat(data[index].price) / data[index].quantity;
    // console.log(data[index].price);

    // console.log(price);
    data[index].price = parseInt(data[index].price) + price;

    data[index].quantity++;

    // console.log(data[index].price);

    // console.log(price);

    this.totalPrice = this.totalPrice + price;
    //console.log(data[index].quantity.toString())
    (data[index].id = data[index].id.toString()),
      (data[index].price = data[index].price.toString()),
      //console.log(sss)

      (this.updateItemArray = data);
  }
  removeQuantity(data, index) {
    // console.log(data);
    // console.log(index);
    let price = parseFloat(data[index].price) / data[index].quantity;
    // console.log(data[index].price);

    // console.log(price);
    data[index].price = parseInt(data[index].price) - price;

    data[index].quantity--;
    // console.log(data[index].quantity);
    if (data[index].quantity === 0) {
      let index1 = data.indexOf(data[index]);
      if (index1 > -1) {
        data.splice(index1, 1);
      }
    }

    // console.log(data[index].price);

    // console.log(price);

    this.totalPrice = this.totalPrice - price;
    (data[index].id = data[index].id.toString()),
      (data[index].price = data[index].price.toString()),
      (this.updateItemArray = data);
  }

  updateCards() {
    if (this.updateItemArray.length) {
      this.updateItemArray = this.updateItemArray.filter((obj) => {
        // console.log(obj);
        return (obj.quantity = obj.quantity.toString());
      });
      this.updateItemArray = this.updateItemArray.filter((obj) => {
        // console.log(obj)
        return (obj.id = obj.id.toString());
      });
    }
    this.barCodeResposeData = this.barCodeResposeData.filter((obj) => {
      // console.log(obj)
      return (obj.id = obj.id.toString());
    });
    this.barCodeResposeData = this.barCodeResposeData.filter(function (props) {
      // delete props.name;
      delete props.offerId;
      delete props.offerName;
      delete props.imageName;
      // props.quantity.toString();
      return true;
    });

    const objeSome = {
      merchantId: this.userData.merchantId,
      // userId: this.merchantId.merchantId,
      userId: this.sendingUserId,
      orderId: this.sendingOrderID,
      items: this.updateItemArray.length
        ? this.updateItemArray
        : this.barCodeResposeData,
      attr: [
        { name: "IS_PAID", value: "Y" },
        { name: "TOTALAMOUNT", value: this.totalPrice.toString() },
      ],
    };

    this.serviceService.updateCardOrder(objeSome).subscribe((res) => {
      if (res.response) {
        window.location.reload();
      }
    });
  }

  confirmOtp(vle: any) {
    // let useId = localStorage.getItem;
    let payLoad = { userId: this.userData.merchantId, orderId: vle.id };
    vle.listOfOrderAttr.forEach((e) => {
      if (e.name == "CONFIRM_OTP") {
        payLoad["OTP"] = e.value;
      }
    });
    // console.log(payLoad);
    //   this.router.navigateByUrl('/RefreshComponent', { skipLocationChange: true }).then(() => {
    //     this.router.navigate(['/home/neworders']);
    // });
    //window.reload()
    this.serviceService.confirm(payLoad).subscribe((res) => {
      const otp = res;
      if (otp.response.message == "OTP Already Verified.") {
        window.location.reload();
        // this.getAllCards(this.limitCount, false);
      }
    });
  }

  //abb barcode
  addBarCode() {
    this.openAddBarForm = true;
    this.getNew();
    //this.barCodeResposeData = [];
  }

  getNew() {
    this.userForm = new FormGroup({
      // 'barcodeNumber': new FormControl(),
      barcodeData: new FormArray([]),
    });
    this.addField();
  }
  addField() {
    let newob = <FormArray>this.userForm.controls["barcodeData"];
    newob.push(this.craeteinterviewrounds());
  }
  craeteinterviewrounds() {
    return new FormGroup({
      barcodeNumber: new FormControl(),
    });
  }
  addData1(index) {
    //console.log(details);
    // console.log(index);
    // console.log(this.barCodeResposeData);
    //   this.listData.filter((obj)=>{
    // console.log(this.listData[index].listOfItems)
    //  obj.listOfIthis.listData[index].listOfItemstems.concat(this.barCodeRespose
    //this.listData[index].listOfItems =  this.listData[index].listOfItems.concat(this.barCodeResposeData)
    // details[index] = details.concat(this.barCodeResposeData);
    //this. barCodeResposeData = this.listData[index].listOfItems;

    this.openAddBarForm = false;
  }

  verify(index) {
    // // console.log(this.userForm.get("barcodeData").value[0].barcodeNumber);

    let url1 =
      `https://scankart.in:8443/sckart-search/getDetailsByCodeByMerchant/${this.userData.merchantId}/Barcode/` +
      this.userForm.get("barcodeData").value[index].barcodeNumber;

    this.serviceService.verify(url1).subscribe((data) => {
      // console.log(data);
      this.responseData = data.response;
      if (data.response.data) {
        let some = {
          id: data.response.data.id.toString(),
          name: data.response.data.name,
          imageName: data.response.data.imageName,
          offerId: data.response.data.offerId,
          offerName: data.response.data.offerName,
          quantity: "1",
          price: data.response.data.price.toString(),
        };

        this.barCodeResposeData = [...this.barCodeResposeData, some];
        // console.log(this.barCodeResposeData);
        this.addField();
        this.totalPrice = this.barCodeResposeData.reduce((a, b) => {
          return a + parseInt(b.price);
        }, 0);
        //console.log(total);
        this.checkIndexno = null;
      } else {
        this.checkIndexno = index;
        // console.log("dddd");
      }
    });
  }

  deleteInput(index) {
    const control = <FormArray>this.userForm.controls["barcodeData"];
    control.removeAt(index);
  }

  @HostListener("window:scroll", ["$event"])

  onWindowScroll(event) {
    console.log(
      window.pageYOffset +
        " " +
        window.innerHeight +
        " " +
        this.containerDOM.nativeElement.offsetHeight +
        " " +
        this.previousLimitCount
    );
    if (window.pageYOffset + window.innerHeight >= this.containerDOM.nativeElement.offsetHeight && window.pageYOffset >= 0) {
      this.direction = "down";
      if (this.limitCount > 0 && this.limitCount < this.totalDataCounttoScroll) {
        //condition to stop scroll
        this.previousLimitCount = this.limitCount - 5;
        this.getAllCards(this.limitCount);
      } else if (window.pageYOffset == 0 && this.previousLimitCount > 0) {
        console.log("UP");
        this.direction = "up";
        console.log("previousLimitCount ******* " + this.previousLimitCount);
        console.log("scrollup====>", this.previousLimitCount);
        this.previousLimitCount < 0 ? 0 : this.previousLimitCount;
        this.previousLimitCount -= 5;
        this.getAllCards(this.previousLimitCount);
      }
    } else if (window.pageYOffset == 0 && this.previousLimitCount > 0) {
      console.log("UP");
      this.direction = "up";
      console.log("previousLimitCount ******* " + this.previousLimitCount);
      console.log("scrollup====>", this.previousLimitCount);
      this.previousLimitCount < 0 ? 0 : this.previousLimitCount;
      this.previousLimitCount -= 5;
      this.getAllCards(this.previousLimitCount);
    }
  }
}

@Pipe({ name: "removeUnderscore" })
export class RemoveUnderscorePipe implements PipeTransform {
  transform(value: any, args?: any): any {
    return value.replace(/_/g, " ");
  }
}
