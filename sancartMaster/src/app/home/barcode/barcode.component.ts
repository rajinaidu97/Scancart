import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { ServiceService } from "../../services/services.service";
import { HttpClient } from "@angular/common/http";
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
  FormArray,
} from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-barcode",
  templateUrl: "./barcode.component.html",
  styleUrls: ["./barcode.component.css"],
})
export class BarcodeComponent implements OnInit {
  barcodeNumber: number;
  //barcodeNumber:'';
  barcode = ''
  userForm: FormGroup;
  responseData;
  totalPrice;
  barCodeReposeData = [];
  checkIndexno;
  userData: any;
  submitted: boolean;
  price: number;
  // globalsSaerch=false
  btnDisabled = false;
 /// addQuantity
 removeQuantity;
 merchantId
  inputText: any;
  click : boolean = true;
  constructor(
    private serviceService: ServiceService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.userData = JSON.parse(localStorage.getItem("user"));
    this.getNew();


  }
   get f() { return this.userForm.controls; }

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
  addData1() {
     this.router.navigate(['/home/neworders'])
  }

  some() {
    //console.log(resData);
    // createOrderByMerchant

    this.barCodeReposeData = this.barCodeReposeData.filter(function (props) {
      //delete props.name;
      delete props.offerId;
      delete props.offerName;
      delete props.imageName;
       //props.quantity.toString();
      return true;
    });
    this.barCodeReposeData = this.barCodeReposeData.filter((obj) => {
      console.log(obj);
      return obj.quantity = obj.quantity.toString();

    });

    const id = JSON.parse(localStorage.getItem('user id'))

    // let objeSome = {
    //   "merchantId":this.userData.merchantId,
    //   "userId": id ,
    //   "items": JSON.stringify(this.barCodeReposeData),
    //   "attr": [
    //     { "name": "IS_PAID", "value": "Y" },
    //     { "name": "TOTALAMOUNT", "value":this.totalPrice.toString() },
    //   ],
    // };

    //(this.updateItemArray.length) ? this.updateItemArray : lisDetails,
    let objeSome = {
      merchantId: this.userData.merchantId,
      //  userId: this.merchantId.merchantId,
      userId: id,
      //orderId: orderId,
      items: this.barCodeReposeData,
      attr: [
        { name: "IS_PAID", value: "Y" },
        { name: "TOTAL_AMOUNT", value: this.totalPrice.toString() },
      ],
    };


    this.serviceService.createOrderByMerchant(objeSome).subscribe((res) => {
      console.log(res);
      this.addData1();
      this.barCodeReposeData = [];
      //  alert("Added Successfully.")
    });

    console.log("gggggg");
    //console.log(resData);
  }

  deleteInput(index){
    const control = <FormArray>this.userForm.controls['barcodeData'];
    control.removeAt(index);
  }

  verify(index) {
    console.log(this.userForm.get("barcodeData").value[0].barcodeNumber);
    this.click = !this.click;
    //this.checkoutFormGroup.get('products')this.checkoutFormGroup.get('products')
    let url1 =
      `https://scankart.in:8443/sckart-search/getDetailsByCodeByMerchant/${this.userData.merchantId}/Barcode/`+
      this.userForm.get("barcodeData").value[index].barcodeNumber;

    this.serviceService.verify(url1).subscribe((data) => {
      console.log(data);
      this.responseData = data.response;
      if (data.response.data) {
         var some = {
          id: data.response.data.id.toString(),
          name: data.response.data.name,
          imageName: data.response.data.imageName,
          offerId: data.response.data.offerId,
          offerName: data.response.data.offerName,
          quantity: 1,
         price: data.response.data.price.toString(),
        };


        this.barCodeReposeData = [...this.barCodeReposeData, some];
        console.log(this.barCodeReposeData);
        this.addField();
        this.totalPrice = this.barCodeReposeData.reduce((a, b) => {
          return a + parseInt(b.price);
        }, 0);
        //console.log(total);
        this.checkIndexno = null;
      } else {
        this.checkIndexno = index;
        console.log("dddd");
      }

    });

  }

  onKey(event: KeyboardEvent) {
    // if value is not empty the set click to false otherwise true
    this.click = (event.target as HTMLInputElement).value === '' ? true:false;
  }

  
  addQuantity1 (data , index){

    // console.log(data);
    // console.log(index);
    let price = parseFloat(data[index].price) / data[index].quantity;
    // console.log(data[index].price);

    //console.log(price);


    data[index].quantity++;
     data[index].price = parseInt(data[index].price)+ price;


    // console.log(data)
0
    //console.log(data[index].price);00

    //console.log(price);

    this.totalPrice = parseInt(data[index].price);
    //console.log(data[index].quantity.toString())
   // data[index].quantity = data[index].quantity.toString()
    (data[index].id = data[index].id.toString()),
      (data[index].price = data[index].price.toString()),
      //console.log(sss)

      (this.barCodeReposeData = data);

  }
  removeQ(data , index){

// console.log(data);
//     console.log(index);
    //let price = parseFloat(data[index].price) / data[index].quantity;
    let price = parseFloat(data[index].price) / data[index].quantity;

    //console.log(data[index].price);

    //console.log(price);
   data[index].price = parseInt(data[index].price) - price;

    data[index].quantity--;
    // console.log(data)
    if (data[index].quantity === 0) {

      let index1 = data.indexOf(data[index]);
        if (index1 > -1) {
          data.splice(index1, 1);
        }
      }

    //console.log(data[index].price);

    //console.log(price);

    this.totalPrice =  parseInt(data[index].price);


    //console.log(data[index].quantity.toString())
   // data[index].quantity = data[index].quantity.toString()
    (data[index].id = data[index].id.toString()),
      (data[index].price = data[index].price.toString()),
      //console.log(sss)

      (this.barCodeReposeData = data);
  }

  // DiasableButton=($event ) =>{
  //   if(this.inputText.length===13) {
  //   this.btnDisabled=false
  //   } else{
  //   this.btnDisabled=true
  //   }
  //   }
}
