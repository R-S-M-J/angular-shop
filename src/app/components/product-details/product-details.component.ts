import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { FormBuilder } from '@angular/forms';

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
  quantity: any;
  userId: number;
  productId: number;
}

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements OnInit {
  productData: product | undefined;
  productQuantity: number = 1;
  quantity: number = 1;
  bulkPurchase: boolean = false;
  idiotPurchase: boolean = false;
  addedtocart: boolean = true;
  removeCart: boolean = false;
  removedCartItem: boolean = false;
  cartData: product | undefined;

  constructor(
    private activeRoute: ActivatedRoute,
    private product: ProductService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    let productId = this.activeRoute.snapshot.paramMap.get('productId');
    // console.log(productId);

    productId &&
      this.product.getProduct(productId).subscribe((result) => {
        // console.log(result);
        this.productData = result;
        let cartData = localStorage.getItem('localCart');
        if (productId && cartData) {
          let items = JSON.parse(cartData);
          items = items.filter(
            (item: product) => productId == item.id.toString()
          );
          if (items.length) {
            this.removeCart = true;
          } else {
            this.removeCart = false;
          }
        }
        let user = localStorage.getItem('user');
        if (user) {
          let userId = user && JSON.parse(user).id;
          this.product.getCartList(userId);
          this.product.cartData.subscribe((result) => {
            let item = result.filter(
              (item: product) =>
                productId?.toString() === item.productId?.toString()
            );
            if (item.length) {
              this.cartData = item[0];
              this.removeCart = true;
            }
          });
        }
      });

    this.addedtocart = false;
  }

  addToCart() {
    if (this.productData) {
      this.productData.quantity = this.productQuantity;
      if (!localStorage.getItem('user')) {
        console.log(this.productData);
        this.product.localAddToCart(this.productData);
        this.addedtocart = true;
        this.removeCart = true;
        this.removedCartItem = false;
      } else {
        let user = localStorage.getItem('user');
        let userId = user && JSON.parse(user).id;
        // console.log("uid",userId);
        let cartData: cart = {
          ...this.productData,
          userId,
          productId: this.productData.id,
        };
        delete cartData.id;
        console.log(cartData);
        this.product.addToCart(cartData).subscribe((result) => {
          if (result) {
            this.product.getCartList(userId);
            this.removeCart = true;
          }
        });
      }
    }
  }

  removeFromCart(productId: number) {
    // console.log(productId)
    if (!localStorage.getItem('user')) {
      this.product.removeItemFromCart(productId);
      this.removeCart = false;
      this.addedtocart = false;
      this.removedCartItem = true;
    } else {
      this.removeCart = false;
      // console.log(this.cartData);
      this.cartData &&
        this.product.removeToCart(this.cartData.id).subscribe((result) => {
          if (result) {
            let user = localStorage.getItem('user');
            let userId = user && JSON.parse(user).id;
            this.product.getCartList(userId);
          }
        });
    }
  }

  handleQuantity(val: String) {
    if (this.productQuantity < 20 && val === 'plus') {
      this.idiotPurchase = false;
      this.bulkPurchase = false;
      this.productQuantity += 1;
    } else if (this.productQuantity > 1 && val === 'minus') {
      this.idiotPurchase = false;
      this.bulkPurchase = false;
      this.productQuantity -= 1;
    } else if (this.productQuantity >= 20) {
      this.bulkPurchase = true;
    } else if (this.productQuantity <= 1) {
      this.idiotPurchase = true;
    }
  }
}
