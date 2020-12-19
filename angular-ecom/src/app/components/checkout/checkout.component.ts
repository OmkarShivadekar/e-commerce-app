import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OnlineShopFormService } from 'src/app/services/online-shop-form.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];



  constructor(private formBuilder: FormBuilder,
              private onlineShopFormService: OnlineShopFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: [''],
        lastName: [''],
        email: ['']
      }),
      shippingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      }),
      billingAddress: this.formBuilder.group({
        country: [''],
        street: [''],
        city: [''],
        state: [''],
        zipCode: ['']
      }),
      creditCard: this.formBuilder.group({
        cardType: [''],
        nameOnCard: [''],
        cardNumber: [''],
        securityCode: [''],
        expireMonth: [''],
        expireYear: ['']
      })
    });

    //populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: "+startMonth);

    this.onlineShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrived card months: "+JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    //populate credit card years
    this.onlineShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrived card years: "+JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

  }

  copyShippingToBilling(event){
    if(event.target.checked){
      this.checkoutFormGroup.controls.billingAddress
        .patchValue(this.checkoutFormGroup.controls.shippingAddress.value);    
    }
    else{
      this.checkoutFormGroup.controls.billingAddress.reset();
    }
  }

  onSubmit(){
    console.log("Handling the submit button");
    console.log(this.checkoutFormGroup.get('customer').value);
  }

  handleMonthYears(){

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');
    
    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expireYear);

    //if the current year equals the selected year, then start with the current month
    let startMonth: number;
    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() + 1;
    }
    else{
      startMonth = 1;
    }

    this.onlineShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrived card months: "+JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );
  }
}
