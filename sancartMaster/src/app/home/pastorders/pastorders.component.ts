import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  AfterViewInit,
  OnChanges,
  ViewChild,
  ElementRef,
  HostListener,
} from "@angular/core";
import { ServiceService } from "../../services/services.service";
import * as AOS from "aos";

@Component({
  selector: "app-pastorders",
  templateUrl: "./pastorders.component.html",
  styleUrls: ["./pastorders.component.css"],
})
export class PastordersComponent implements OnInit {
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

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem("user"));
    // if(this.listData.length == 0 && !this.isSearchEnabled){
    //   let url = `https://scankart.in:8443/sckart-search/getOrdersByMerchant/${this.userData.merchantId}/COMPLETED/0`;
    //   this.serviceService.completedOrder(url).subscribe(data=>{
    //   this.listData=data.response.data
    //   // this.orders = data.response.data
    //  })
    // }
    setTimeout(() => {
      if (this.listData.length === 0 && !this.isSearchEnabled) {
        this.getAllCards(this.limitCount);
      }
    });
  }

  getAllCards(limitCount: number) {
    // console.log(this.listData.length);
    // console.log(this.userData.merchantId);
    let url = `https://scankart.in:8443/sckart-search/getOrdersByMerchant/${this.userData.merchantId}/COMPLETED/${limitCount}`;
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
  ngAfterViewInit() {}
  ngOnChanges(changes: SimpleChanges) {
    // console.log(changes);
    if (changes.listData) {
      // console.log("searhed");
    } else {
      // console.log("new orders ddddd");
    }
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
    if (
      window.pageYOffset + window.innerHeight >=
        this.containerDOM.nativeElement.offsetHeight &&
      window.pageYOffset >= 0
    ) {
      this.direction = "down";
      if (
        this.limitCount > 0 &&
        this.limitCount < this.totalDataCounttoScroll
      ) {
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
