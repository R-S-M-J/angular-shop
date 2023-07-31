import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

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

interface product {
  id: number;
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
  quantity: any;
  productId: undefined | number;
}

interface priceSummary {
  price: number;
  discount: number;
  tax: number;
  delivery: number;
  total: number;
}

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css'],
})
export class CartPageComponent implements OnInit {
  cartData: cart[] | undefined;
  productQuantity: number = 1;
  empty: boolean = false;
  priceSummary: priceSummary = {
    price: 0,
    discount: 0,
    tax: 0,
    delivery: 0,
    total: 0,
  };
  constructor(private product: ProductService, private router: Router) {}

  ngOnInit(): void {
    let user = localStorage.getItem('user');
    if(!user){
      this.router.navigate(['user-auth']);
    }
    this.loadDetails();
  }

  loadDetails() {
    this.product.currentCart().subscribe((result) => {
      console.log("cartdata",result);
      this.cartData = result;
      if (result && result.length) {
        this.empty = false;
      } else {
        this.empty = true;
      }
      let price = 0;
      result.forEach((item) => {
        price = price + item.price * item.quantity;
        console.log(price);
      });
      this.priceSummary.price = price;
      if (price > 100000) {
        this.priceSummary.discount = price / 10;
      } else if (price > 50000) {
        this.priceSummary.discount = price / 5;
      } else {
        this.priceSummary.discount = 0;
      }
      this.priceSummary.tax = 8000;
      if (price > 50000) {
        this.priceSummary.delivery = 500;
      } else {
        this.priceSummary.delivery = 1000;
      }
      this.priceSummary.total =
        price -
        this.priceSummary.discount +
        this.priceSummary.tax +
        this.priceSummary.delivery;
    });
  }

  handleQuantity(val: String) {
    if (this.productQuantity < 20 && val === 'plus') {
      this.productQuantity += 1;
    } else if (this.productQuantity > 1 && val === 'minus') {
      this.productQuantity -= 1;
    }
  }

  checkout() {
    this.router.navigate(['/checkout']);
  }

  removeFromCart(cartId: number | undefined) {
    cartId &&
      this.cartData &&
      this.product.removeToCart(cartId).subscribe((result) => {
        if (result) {
          this.loadDetails();
          let user = localStorage.getItem('user');
          let userId = user && JSON.parse(user).id;
          this.product.getCartList(userId);
        }
      });
  }
}
