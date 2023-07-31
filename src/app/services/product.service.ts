import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

interface products{
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

interface productsWid{
  id:number;
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

interface productsWidAq{
  id:number;
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
  quantity:undefined | number;
  productId:undefined | number;
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
  userId:number;
  productId:number;
}

interface order{
  name: string,
  email: string,
  address: string,
  state: string,
  city: string,
  zip: string,
  pay: string,
  totalPrice: number;
  userId: number;
  id:number | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  cartData=new EventEmitter<productsWidAq[] | []>();

  constructor(private http:HttpClient) { }

  addProduct(data:products){
    // console.log(data);
    return this.http.post('http://localhost:5000/products',data);
  }
  
  productList(){
    return this.http.get<productsWid[]>('http://localhost:5000/products');
  }

  editProduct(index: number) {
    return this.http.get<products[]>('http://localhost:5000/products').pipe(
      map((products: products[]) => {
        if (index >= 0 && index < products.length) {
          return products[index];
        } else {
          throw new Error('Invalid index');
        }
      })
    );
  }

  getProduct(id:string){
    return this.http.get<productsWidAq>(`http://localhost:5000/products/${id}`);
  }

  deleteProduct(index:number){
    return this.http.delete(`http://localhost:5000/products/${index}`);
  }

  searchProducts(query:string){
    return this.http.get<productsWid[]>(`http://localhost:5000/products?q=${query}`);
  }

  trendyProducrs(){
    return this.http.get<productsWid[]>("http://localhost:5000/products?_limit=8");
  }

  localAddToCart(data:productsWidAq){
    let cartData=[];
    let localCart=localStorage.getItem('localCart');
    if(!localCart){
      localStorage.setItem('localCart',JSON.stringify([data]));
      this.cartData.emit([data]);
    }else{
      cartData=JSON.parse(localCart);
      cartData.push(data);
      localStorage.setItem('localCart',JSON.stringify(cartData));
    }
    this.cartData.emit(cartData);
  }

  removeItemFromCart(productId:number){
    let cartData=localStorage.getItem('localCart');
    if(cartData){
      let items:productsWidAq[]=JSON.parse(cartData);
      // console.log(items);
      items=items.filter((item:productsWidAq)=>productId!==item.id)
      localStorage.setItem('localCart',JSON.stringify(items));
      this.cartData.emit(items);
    }
  }

  addToCart(cartData:cart){
    return this.http.post('http://localhost:5000/cart',cartData);
  }

  getCartList(userId:number){
    this.http.get<productsWidAq[]>('http://localhost:5000/cart?userId='+userId,
    {observe:'response'}).subscribe((result)=>{
      console.log(result);
      
      if(result && result.body){
        this.cartData.emit(result.body);
      }
    });
  }
  
  removeToCart(cartId:number){
    return this.http.delete('http://localhost:5000/cart/'+cartId);
  }

  currentCart(){
    let userStore=localStorage.getItem('user');
    let userData=userStore && JSON.parse(userStore);
    return this.http.get<cart[]>('http://localhost:5000/cart?userId='+userData.id);
  }

  orderNow(data:order){
    return this.http.post('http://localhost:5000/orders',data);
  }

  orderList(){
    let userStore=localStorage.getItem('user');
    let userData=userStore && JSON.parse(userStore);
    return this.http.get<order[]>('http://localhost:5000/orders?userId='+userData.id);
  }

  deleteCartItems(cartId:number){
    return this.http.delete('http://localhost:5000/cart/'+cartId,{observe:'response'}).subscribe((result)=>{
      if(result){
        this.cartData.emit([])
      }
    });
  }

  cancelOrder(orderId:number){
    return this.http.delete('http://localhost:5000/orders/'+orderId)
  }

  // sendOrderEmail(orderData: any){
  //   return this.http.post('http://localhost:5000/orders/orders', orderData);
  // }
  
}
