import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';

interface SignUp {
  name: string;
  gender: string;
  date: string;
  email: string;
  pass: string;
  address: string;
}

interface ilogin {
  email: string;
  pass: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userAuth=new EventEmitter<boolean>(false);
  constructor(private http:HttpClient, private router:Router) { }

  userSignUp(user:SignUp){
    console.log(user);
    this.http.post('http://localhost:5000/users',user,{observe:'response'}).subscribe((result)=>{
    console.log(result);
    if(result){
      localStorage.setItem('user',JSON.stringify(result.body));
      this.router.navigate(['/']);
    }
    });
  }

  userLogin(user:ilogin){
    console.log("user",user);
    this.http.get<SignUp[]>(`http://localhost:5000/users?email=${user.email}&pass=${user.pass}`,{observe:'response'})
    .subscribe((result)=>{
    console.log(result);
    if(result && result.body && result.body.length){
      localStorage.setItem('user',JSON.stringify(result.body[0]));
      this.userAuth.emit(false);
      this.router.navigate(['/']);
    }else{
      this.userAuth.emit(true);
    }
    });

    this.http
      .get(
        `http://localhost:5000/seller?email=${user.email}&password=${user.pass}`,
        { observe: 'response' }
      )
      .subscribe((result: any) => {
        console.log('result', result);
        if (result && result.body && result.body.length) {
          console.log('user logged in');
          localStorage.setItem('seller', JSON.stringify(result.body));
          this.router.navigate(['seller-home']);
          console.log('result', result);
        } else {
          console.log('login failed');
          this.userAuth.emit(true);
        }
      });
  }

  userAuthReload(){
    if(localStorage.getItem('user')){
      this.router.navigate(['/']);
    }
  }
}
