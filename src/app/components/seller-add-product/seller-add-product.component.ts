import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { ProductService } from 'src/app/services/product.service';

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

@Component({
  selector: 'app-seller-add-product',
  templateUrl: './seller-add-product.component.html',
  styleUrls: ['./seller-add-product.component.css']
})
export class SellerAddProductComponent implements OnInit{

  constructor(private fb: FormBuilder,private product:ProductService) { }

  ngOnInit(): void {
      
  }

  addProductResult:number=0;

  productName="";
  price:number=0;
  brand="";
  processor="";
  color="";
  Category="";
  range="";
  expiry="";
  Description="";
  image="";

  productForm = this.fb.group({
    productName: ['', [Validators.required]],
    brand: ['', [Validators.required]],
    price: [0,[Validators.required]],
    processor: ['', [Validators.required]],
    color: ['', [Validators.required]],
    Category: ['', [Validators.required]],
    range: ['', [Validators.required]],
    expiry: ['', [Validators.required]],
    Description: ['', [Validators.minLength(10)]],
    image: ['', [Validators.minLength(8), Validators.required]],
  });

  submit(){
    console.log(this.productForm.value);
    const newProduct:products = {
      productName: this.productForm.value.productName || '',
      brand: this.productForm.value.brand || '',
      price: Number(this.productForm.value.price),
      processor: this.productForm.value.processor || '',
      color: this.productForm.value.color || '',
      Category: this.productForm.value.Category || '',
      range: this.productForm.value.range || '',
      expiry: this.productForm.value.expiry || '',
      Description: this.productForm.value.Description || '',
      image: this.productForm.value.image || '',
    };
    this.product.addProduct(newProduct).subscribe((result)=>{
      console.log(result);
      if(result){
        this.addProductResult=1;
      }else{
        this.addProductResult=2;
      }
      setTimeout(()=>(this.addProductResult=0),3000);
    });
    this.productForm.reset();
  }

}
