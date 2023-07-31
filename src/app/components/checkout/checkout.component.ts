import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import emailjs from '@emailjs/browser';

interface cart {
  id: number | undefined;
  productName: string;
  price: number;
  brand: string;
  processor: string;
  color: string;
  Category: string;
  range: string;
  expiry: string;
  Description: string;
  image: string;
  quantity: number;
  userId: number;
  productId: number;
}

interface priceSummary {
  price: number;
  discount: number;
  tax: number;
  delivery: number;
  total: number;
}

interface order {
  name: string;
  email: string;
  address: string;
  state: string;
  city: string;
  zip: string;
  pay: string;
  totalPrice: number;
  userId: number;
  id: number | undefined;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  cartData: cart[] | undefined;
  totalPrice: number | undefined;
  priceSummary: priceSummary[] | undefined;
  nft: boolean = false;
  wallet: boolean = false;
  prepaid: boolean = false;
  cod: boolean = false;

  constructor(
    private product: ProductService,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.product.currentCart().subscribe((result) => {
      // console.log(result);
      this.cartData = result;
      let price = 0;
      result.forEach((item) => {
        price = price + item.price * item.quantity;
        // console.log(price);
      });
      this.totalPrice = price;

      if (price > 100000) {
        this.totalPrice -= price / 10;
      } else if (price > 50000) {
        this.totalPrice -= price / 5;
      }
      this.totalPrice += 8000;
      if (price > 50000) {
        this.totalPrice += 500;
      } else {
        this.totalPrice += 1000;
      }
    });
  }

  checkoutForm = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required]],
    address: ['', [Validators.required]],
    state: ['', [Validators.required]],
    city: ['', [Validators.required]],
    zip: ['', [Validators.required]],
    pay: ['', [Validators.required]],
  });

  orderNow() {
    console.log(this.checkoutForm.value);
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;
    const data = {
      name: this.checkoutForm.value.name || '',
      email: this.checkoutForm.value.email || '',
      address: this.checkoutForm.value.address || '',
      state: this.checkoutForm.value.state || '',
      city: this.checkoutForm.value.city || '',
      zip: this.checkoutForm.value.zip || '',
      pay: this.checkoutForm.value.pay || '',
    };
    if (this.totalPrice) {
      let orderData: order = {
        ...data,
        totalPrice: this.totalPrice,
        userId,
        id: undefined,
      };
      this.cartData?.forEach((item) => {
        setTimeout(() => {
          item.id && this.product.deleteCartItems(item.id);
        }, 700);
      });
      this.product.orderNow(orderData).subscribe((result) => {
        if (result) {
          Swal.fire({
            title: 'Order Placed Succefully!',
            icon: 'success',
            width: 600,
            padding: '3em',
            color: '#A764FF',
            confirmButtonColor: '#00CC00',
            confirmButtonText: 'Yay!',
            backdrop: `
              rgba(167, 100, 225, 0.4)
              url("https://media2.giphy.com/media/0DN1sOA7EdO57HVi9f/200w.webp?cid=ecf05e47964w11ktodpudk3h5aeyyagfc7to2isqi2v3uo49&ep=v1_gifs_search&rid=200w.webp&ct=g")
              left top
              no-repeat`,
          }).then(async () => {
            emailjs.init('r26EUpL4atQy_MHFe');
            let response=await emailjs.send('service_znog23p','template_o0gkigi',{
              to_name: this.checkoutForm.value.name,
              email: this.checkoutForm.value.email,
              address: this.checkoutForm.value.address,
            })
            this.router.navigate(['/my-orders'], {
              queryParams: { orderPlaced: true },
            });
          });
          
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
          });
        }
      });
    }
  }

  toggle(val: string) {
    if (val == 'nft') {
      this.nft = true;
      this.prepaid = false;
      this.wallet = false;
      this.cod = false;
    } else if (val == 'prepaid') {
      this.nft = false;
      this.prepaid = true;
      this.wallet = false;
      this.cod = false;
    } else if (val == 'wallet') {
      this.nft = false;
      this.prepaid = false;
      this.wallet = true;
      this.cod = false;
    } else if (val == 'cod') {
      this.nft = false;
      this.prepaid = false;
      this.wallet = false;
      this.cod = true;
    }
  }
}
