import { Component } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';
import { getPagerFromHeaders } from '../../shared/helpers/pager-from-headers-creator';
import { CommonModule } from '@angular/common';
import { OrderStatusPipe } from '../../shared/pipes/order-status-pipe';
import { ChangeBGOnOrderStatus } from '../../shared/directives/change-bg-on-order-status';
import { DefaultFilter } from '../../models/filters/default-filter.model';
import { PaginationComponent } from '../shared/pagination/pagination.component';
import { environment } from './../../../environments/environment';
import { RouterModule } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    OrderStatusPipe,
    ChangeBGOnOrderStatus,
    PaginationComponent,
    RouterModule,
  ],
  providers: [OrderService],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css',
})
export class MyOrdersComponent {
  urlProductImages = environment.PRODUCT_IMAGES_URL;
  orders: Order[] = [];
  pager: any;
  filter: DefaultFilter = {
    pageIndex: 1,
    pageSize: 10,
  };
  constructor(private orderService: OrderService, public location: Location) {}

  ngOnInit() {
    this.getAllOrdersForCurrentUser();
  }

  getAllOrdersForCurrentUser() {
    this.orderService
      .getAllOrdersForCurrentUser(this.filter)
      .subscribe((res: any) => {
        this.orders = res.body;
        this.pager = getPagerFromHeaders(res.headers);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }

  pageIndexChanged(page: number) {
    this.filter = { ...this.filter, pageIndex: page };
    this.getAllOrdersForCurrentUser();
  }
}
