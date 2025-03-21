import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import * as OrderActions from '../actions/orderActions';
import { getPagerFromHeaders } from '../../shared/helpers/pager-from-headers-creator';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Injectable()
export class OrderEffects {
  constructor(private orderService: OrderService) {}

  private actions$ = inject(Actions); //injecting this in constructor caused undefined error.

  loadOrders$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.loadOrders),
      switchMap((action) =>
        this.orderService.getAllOrders(action.filter).pipe(
          map((ordersResponse: any) => {
            let pager = getPagerFromHeaders(ordersResponse.headers);
            let ordersObject: { pager: any; orderList: Order[] } = {
              pager: pager,
              orderList: ordersResponse.body,
            };
            return OrderActions.loadOrdersSuccess({
              orders: ordersObject,
            });
          }),
          catchError((error) =>
            of(OrderActions.loadOrdersFailure({ error: error.message }))
          )
        )
      )
    )
  );

  changeOrderStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(OrderActions.changeOrderStatusAdmin),
      switchMap((action) =>
        this.orderService.changeStatus(action.changeOrderStatus).pipe(
          map((changeOrderStatus: any) =>
            OrderActions.changeOrderStatusAdminSuccess({
              changeOrderStatus: action.changeOrderStatus,
            })
          ),
          catchError((error) =>
            of(
              OrderActions.changeOrderStatusAdminFailure({
                error: error.message,
              })
            )
          )
        )
      )
    )
  );
}
