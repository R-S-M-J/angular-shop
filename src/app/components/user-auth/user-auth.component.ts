import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControlName, FormControl } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';


interface ilogin {
  email: string;
  pass: string;
}

interface SignUp {
  name: string;
  gender: string;
  date: string;
  email: string;
  pass: string;
  address: string;
}

interface productsWidAq {
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
  quantity: undefined | number;
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
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent implements OnInit {

  constructor(private fb: FormBuilder, private user: UserService, private product: ProductService) { }

  ngOnInit(): void {
    this.user.userAuthReload();
  }

  email: string = "";
  name: string = "";
  date: string = "";
  pass: string = "";
  cpass: string = "";
  gender: string = "";
  address: string = "";
  submitted = false;
  showSignup: boolean = false;
  @Output() btnClick = new EventEmitter();
  authError: boolean = false;

  signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(20)]],
    date: ['', [Validators.required]],
    address: ['', [Validators.required, Validators.maxLength(60)]],
    gender: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    pass: ['', [Validators.minLength(8), Validators.pattern('^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$')]],
    cpass: ['', [Validators.minLength(8), Validators.pattern('^(?=.*?[A-Za-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$')]],
  });

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    pass: ['', [Validators.minLength(4), Validators.required]],
  });

  signUp() {
    console.log(this.signupForm.value);
    if (this.pass != this.cpass) {
      alert("Password and Confirm Password should be same");
      return;
    } else {
      if (this.signupForm.valid && this.pass == this.cpass) {
        const newUser: SignUp = {
          address: this.signupForm.value.address || '',
          name: this.signupForm.value.name || '',
          gender: this.signupForm.value.gender || '',
          date: this.signupForm.value.date || '',
          email: this.signupForm.value.email || '',
          pass: this.signupForm.value.pass || '',
        };
        this.user.userSignUp(newUser);
      }
    }
  }

  login() {
    // this.authError=false;
    const chkUser: ilogin = {
      email: this.loginForm.value.email || '',
      pass: this.loginForm.value.pass || '',
    };
    this.user.userLogin(chkUser);
    console.log(this.loginForm.value);
    this.user.userAuth.subscribe((result) => {
      if (result) {
        this.authError = true;                  // invalid credentials
      } else {
        this.localCartToRemoteCart();         //add the cart data from localstorage to db after user login
      }
    })
  }

  localCartToRemoteCart() {
    let data = localStorage.getItem('localCart');
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;
    if (data) {
      let cartDataList: productsWidAq[] = JSON.parse(data);  
      console.log("uid", userId);

      cartDataList.forEach((product: productsWidAq, index) => {
        let cartData: cart = {
          ...product,
          productId: product.id,
          userId,
        }
        console.log("cartData", cartData);
        delete cartData.id;
        setTimeout(() => {  
          this.product.addToCart(cartData).subscribe((result) => {
            if (result) {
              console.log("added cart item to db");
            }
          })
        }, 500);
        if (cartDataList.length === index + 1) {
          localStorage.removeItem('localCart');
        }
      });
    }

    setTimeout(() => {
      this.product.getCartList(userId);           //to update cart qquantity after user login
    }, 2000);
    
  }



  openLogin() {
    this.showSignup = false;
  }
  openSignUp() {
    this.showSignup = true;
  }
}
