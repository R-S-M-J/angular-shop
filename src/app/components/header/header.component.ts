import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { FormControl, FormGroup } from '@angular/forms';
import { faArrowRight, faCartShopping } from '@fortawesome/free-solid-svg-icons';

interface products{
  id:number
  productName:string;
  price:number;
  brand:string;
  processor:string;
  color:string;
  Category:string;
  range:string;
  expiry:string;
  Description:string;
  image:string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  menuType:string='default';
  searchInputt:FormControl= new FormControl('');
  sellerName:string='';
  userName:string='';
  cartItems=0;
  searchResult:undefined | products[];
  searchopt=false;
  faArrowRight=faArrowRight;
  faCartShopping=faCartShopping;

  constructor(private route:Router, private product:ProductService){}

  ngOnInit(): void {
    this.route.events.subscribe((val:any)=>{
      // console.log(val.url);
      if(val.url){
        if(localStorage.getItem('seller') && val.url.includes('seller')){
          // console.log('seller area');
          this.menuType='seller';
          let sellerStore=localStorage.getItem('seller');
          let sellerData=sellerStore && JSON.parse(sellerStore)[0];
          this.sellerName=sellerData.fname;
        }else if(localStorage.getItem('user')){
          let userStore=localStorage.getItem('user');
          let userData=userStore && JSON.parse(userStore);
          this.userName=userData.name;
          this.menuType='user';
          this.product.getCartList(userData.id);
        }else{
          // console.log('default area');
          this.menuType='default';
        }
      }
    })

    let cartData=localStorage.getItem('localCart');
    if(cartData){
      this.cartItems=JSON.parse(cartData).length;
    }

    this.product.cartData.subscribe((result)=>{
      this.cartItems=result.length;
    })
  }

  logout(){
    localStorage.removeItem('seller');
    this.route.navigate(['/']);
  }

  userlogout(){
    localStorage.removeItem('user');
    this.route.navigate(['/']);
    this.product.cartData.emit([]);
  }

  searchProduct(query:KeyboardEvent){
  const element = query.target as HTMLInputElement;
    if (element.value.trim().length > 0) {
      this.searchopt = true;
      this.product.searchProducts(element.value).subscribe((result) => {
        // console.warn(result);
        this.searchResult = result;
      });
    } else {
      this.searchopt = false;
      this.searchResult = [];
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.keyCode === 13) {
      this.submitSearch();
    }
  }

  submitSearch(){
    this.route.navigate([`search/${this.searchInputt.value}`]);
    this.searchopt=false;
  }
}
