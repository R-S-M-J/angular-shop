import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

interface SignUp {
  fname: string;
  lname: string;
  gender: string;
  date: string;
  email: string;
  pass: string;
}

interface login {
  email: string;
  pass: string;
}

@Injectable({
  providedIn: 'root',
})
export class SellerService {
  isSellerLoggedIn = new BehaviorSubject<boolean>(false);
  isLoginErr = new EventEmitter<boolean>(false);

  constructor(private http: HttpClient, private router: Router) {}
  userSignUp(data: SignUp) {
    this.http
      .post('http://localhost:5000/seller', data, { observe: 'response' })
      .subscribe((result) => {
        this.isSellerLoggedIn.next(true);
        localStorage.setItem('seller', JSON.stringify(result.body));
        if (result) {
          this.router.navigate(['seller-home']);
          console.log('result', result);
        }
      });
  }

  userLogin(data: login) {
    console.log(data);
    this.http
      .get(
        `http://localhost:5000/seller?email=${data.email}&password=${data.pass}`,
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
          this.isLoginErr.emit(true);
        }
      });
  }

  reloadSeller() {
    if (localStorage.getItem('seller')) {
      this.isSellerLoggedIn.next(true);
      this.router.navigate(['seller-home']);
    }
  }
}
