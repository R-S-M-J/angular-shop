import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { ActivatedRoute } from '@angular/router';

interface products{
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

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit{
  productList:undefined | products[];
  noMatch=false;

  constructor(private product:ProductService,private activeRoute:ActivatedRoute){}

  ngOnInit(): void {
    this.activeRoute.paramMap.subscribe((params) => {
      const query = params.get('query');
      console.log(query);
      if (query) {
        this.product.searchProducts(query).subscribe((result) => {
          if (result.length === 0) {
            this.noMatch = true;
          } else {
            this.noMatch = false;
            this.productList = result;
          }
        });
      }
    });
  }
}
