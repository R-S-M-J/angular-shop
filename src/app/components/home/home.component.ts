import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

interface products {
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
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  constructor(private product: ProductService) {}

  ngOnInit(): void {
    this.list();
  }

  productList: undefined | products[];

  list() {
    this.product.productList().subscribe((result) => {
      console.log(result);
      this.productList = result;
    });
  }
}
