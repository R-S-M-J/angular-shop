import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, Validators, FormBuilder } from '@angular/forms';
import { SellerService } from 'src/app/services/seller.service';
import { Router, RouterOutlet } from '@angular/router';
import { NgModule } from '@angular/core';

interface SignUp {
  fname: string;
  lname: string;
  gender: string;
  date: string;
  email: string;
  pass: string;
}

interface ilogin {
  email: string;
  pass: string;
}

@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css']
})
export class SellerAuthComponent {
  title: string='SignUp Page';
  email: string = "";
  fname: string = "";
  lname: string = "";
  date: string = "";
  pass: string = "";
  cpass: string = "";
  gender: string = "";
  @Output() btnClick = new EventEmitter();
  submitted = false;
  showSignup:boolean=true;
  authError:boolean=false;

  signupForm = this.fb.group({
    fname: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
    lname: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
    date: ['', [Validators.required]],
    gender: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
    pass: ['', [Validators.minLength(8), Validators.pattern('^(?=.*[@])(?=.*[A-Z]).*$'), Validators.required]],
    cpass: ['', [Validators.minLength(8), Validators.pattern('^(?=.*[@])(?=.*[A-Z]).*$'), Validators.required]],
  });

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.pattern('^[a-zA-Z]+$')]],
    pass: ['', [Validators.minLength(8), Validators.pattern('^(?=.*[@])(?=.*[A-Z]).*$'), Validators.required]],
  });

  ngOnInit() {
    // this.httpService.getDataa().subscribe(data=>{console.log(data);})
    this.seller.reloadSeller();
  }

  constructor(private fb: FormBuilder,private seller:SellerService) { }


  signUp() {
    if(this.pass != this.cpass){
      alert('passwords do not match');
      return;
    }
    const newUser:SignUp = {
      fname: this.signupForm.value.fname || '',
      lname: this.signupForm.value.lname || '',
      gender: this.signupForm.value.gender || '',
      date: this.signupForm.value.date || '',
      email: this.signupForm.value.email || '',
      pass: this.signupForm.value.pass || '',
    };
    this.seller.userSignUp(newUser);
    this.btnClick.emit(); {
      console.log(this.signupForm.value);
    }
  }

  login(){
    this.authError=false;
    const chkUser:ilogin = {
      email: this.loginForm.value.email || '',
      pass: this.loginForm.value.pass || '',
    };
    this.seller.userLogin(chkUser);
    console.log(this.loginForm.value);
    this.seller.isLoginErr.subscribe((isError)=>{
      if(isError){
        this.authError=true;
        this.loginForm.reset();
      }
    });
  }

  openLogin(){
    this.showSignup=false;
  }
  openSignUp(){
    this.showSignup=true;
  }
}
