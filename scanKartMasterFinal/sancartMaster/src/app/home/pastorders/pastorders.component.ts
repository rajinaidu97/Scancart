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
  count = 0;
  throttle = 300;
  scrollDistance = 2;
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
  pageNumber = 0;
  size = 5;
  totalPages = 0;
  pageNumbers = [];
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
  config: { itemsPerPage: number; currentPage: any; totalItems: number; };
  page: any;
  exampleModalCenter: any;
  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem("user"));

    if (this.listData.length === 0) {
      this.previousLimitCount = this.limitCount;
      this.getAllCards(this.limitCount, false);
    }
  }

  getAllCards(limitCount: number, isScrollUp: boolean) {
    // console.log(this.listData.length);
    // console.log(this.userData.merchantId);
    let url = `https://scankart.in:8443/sckart-search/getOrdersByMerchant/${this.userData.merchantId}/COMPLETED/${limitCount}`;
    this.serviceService.currentOrder(url).subscribe((data) => {

      console.log(data.response.data);
      if (data.response.data.length !==0) {
        this.listData = data.response.data;

        this.listData.filter((obj)=>{
          this.barCodeResposeData = obj.listOfItems
        })

       this.totalPages = Math.ceil(data.response.totalCount/this.size);
        if (this.totalPages > 0) {
          for (var i = 0; i < this.totalPages; i++) {
              this.pageNumbers.push(i);
          }
      }
      }
    });
  }

  next(){
    this.pageNumber = this.pageNumber + 1;
    this.limitCount= this.limitCount + 5;
    this.getAllCards(this.limitCount, false);
    // CredCtrl.goToReports ($scope.obj);

  }

  previous(){
       this.pageNumber = this.pageNumber - 1;
       if(this.limitCount >5){
        this.limitCount= this.limitCount - 5;
       }
       this.getAllCards(this.limitCount, false);
      //  CredCtrl.goToReports ($scope.obj);
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

}
