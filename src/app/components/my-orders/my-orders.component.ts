import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';

interface order {
  name: string;
  email: string;
  address: string;
  state: string;
  city: string;
  zip: string;
  pay: string;
  totalPrice: number;
  userId: number;
  id: number | undefined;
}

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css'],
})
export class MyOrdersComponent implements OnInit {
  orderData: order[] | undefined;
  isVariableSet: boolean = false;

  constructor(private product: ProductService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['orderPlaced'] === 'true') {
        this.isVariableSet = true;
      }
    });
    this.getOrderList();
  }

  cancelOrder(orderId: number | undefined) {
    orderId &&
      this.product.cancelOrder(orderId).subscribe((result) => {
        this.getOrderList();
      });
  }

  getOrderList() {
    this.product.orderList().subscribe((result) => {
      this.orderData = result;
      console.log(result);
    });
  }
}
