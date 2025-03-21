import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { DefaultFilter } from '../../../models/filters/default-filter.model';
import { OrderStatusPipe } from '../../../shared/pipes/order-status-pipe';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';
import { Order } from '../../../models/order.model';
import { Router, RouterModule } from '@angular/router';
import { AppState } from '../../../store/store';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import * as OrderActions from '../../../store/actions/orderActions';
import { ChangeBGOnOrderStatus } from '../../../shared/directives/change-bg-on-order-status';
import { OrderStatus } from '../../../models/orderStatusEnum.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    CommonModule,
    PaginationComponent,
    OrderStatusPipe,
    ChangeBGOnOrderStatus,
    RouterModule,
    FormsModule,
  ],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css',
})
export class AdminOrdersComponent {
  urlProductImages = environment.PRODUCT_IMAGES_URL;
  ordersState$: Observable<{
    pager: any;
    orderList: Order[] | undefined | null;
  }>;
  pager: any;
  filter: DefaultFilter = {
    pageIndex: 1,
    pageSize: 10,
  };
  editStatusOrderId = 0;
  editStatusIndex = -1;
  selectedOrderStatus = -1;
  orderStatuses: { key: string; value: number }[] = [];
  activeTab: 'Orders' | 'Products' | 'Categories' | 'PromoCodes' = 'Orders';
  constructor(
    private store: Store<AppState>,
    private actions$: Actions
  ) {
    this.ordersState$ = this.store.select((state) => state.order.orders);
  }

  ngOnInit() {
    this.orderStatuses = Object.entries(OrderStatus)
      .filter((x) => {
        return Number.isNaN(Number(x[0]));
      })
      .map(([key, valuePar]) => {
        let value = Number(valuePar);
        return { key, value };
      });

    this.actions$
      .pipe(ofType(OrderActions.loadOrdersSuccess))
      .subscribe((data: any) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    this.getOrders();
  }

  getOrders() {
    this.store.dispatch(OrderActions.loadOrders({ filter: this.filter }));
  }

  editStatus(orderId: number, i: number, orderStatus: OrderStatus | null) {
    this.editStatusOrderId = orderId;
    this.editStatusIndex = i;
    this.selectedOrderStatus =
      OrderStatus[OrderStatus[Number(orderStatus)] as keyof typeof OrderStatus];
  }

  saveEditedStatus() {
    this.store.dispatch(
      OrderActions.changeOrderStatusAdmin({
        changeOrderStatus: {
          orderId: this.editStatusOrderId,
          newStatus: Number(this.selectedOrderStatus),
        },
      })
    );

    this.editStatusOrderId = 0;
    this.editStatusIndex = -1;
  }

  changeTab(tab: any) {
    this.activeTab = tab;
  }

  pageIndexChanged(page: number) {
    this.filter = { ...this.filter, pageIndex: page };
    this.getOrders();
  }
}
