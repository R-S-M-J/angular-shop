import { Component, OnInit } from '@angular/core';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ProductService } from 'src/app/services/product.service';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';


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
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css'],
})
export class SellerHomeComponent implements OnInit{

  productList:undefined | products[];
  selectedRowIndex: number = -1;
  showModalEdit:boolean=false;

  faPencil = faPencil;
  faTrash = faTrash;

  constructor(private product:ProductService,private fb:FormBuilder,private http:HttpClient){}

  ngOnInit(): void {
    this.list();
  }

  editForm=this.fb.group({
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

  editProduct(index: number) {
    this.product.editProduct(index).subscribe(
      (productData) => {
        console.log('Product Data:', productData);
        this.editForm.patchValue({
          productName: productData.productName,
          brand: productData.brand,
          price: productData.price,
          processor: productData.processor,
          color: productData.color,
          Category: productData.Category,
          range: productData.range,
          expiry: productData.expiry,
          Description: productData.Description,
          image: productData.image,
        });
      },
      (error) => {
        console.error('Error:', error);
      }
    );
    this.showModalEdit=true;
    this.selectedRowIndex = index+1;
  }

  onSubmitEdit() {
    console.log("selected row index: ", this.selectedRowIndex);
  
    const updatedTask = {
      productName: this.editForm.value.productName,
      brand: this.editForm.value.brand,
      price: this.editForm.value.price,
      processor: this.editForm.value.processor,
      color: this.editForm.value.color,
      Category: this.editForm.value.Category,
      range: this.editForm.value.range,
      expiry: this.editForm.value.expiry,
      Description: this.editForm.value.Description,
      image: this.editForm.value.image,
    };
    this.http.put(`http://localhost:5000/products/${this.selectedRowIndex}`, updatedTask).subscribe(
      (response) => {
        console.log('Data updated successfully:', response);
      },
      (error) => {
        console.error('Error updating data:', error);
      }
    );
    this.list();
  
    this.toggleModalEdit();
    this.selectedRowIndex = -1;
    this.editForm.reset();
  }
  
  deleteProduct(index:number){
    console.log("deleting ",index);
    this.product.deleteProduct(index).subscribe((result)=>{
      if(result){
        Swal.fire({
          title: 'Deleted!',
          text: 'Your file has been deleted.',
          icon: 'success',
        }).then(() => {
          this.list();
        });
        console.log("product deleted");
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Something went wrong!',
          footer: '<a href="">Why do I have this issue?</a>'
        })
        console.log("error while deleting");
      }
    })
  }

  list(){
    this.product.productList().subscribe((result)=>{
      console.log(result);
      this.productList=result;
    })
  }

  toggleModalEdit(){
    this.showModalEdit=false;
  }
}