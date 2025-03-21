import { createAction, props } from '@ngrx/store';
import { DefaultFilter } from '../../models/filters/default-filter.model';
import { Order } from '../../models/order.model';
import { ChangeOrderStatusRequest } from '../../models/request-models/changeOrderStatusRequest.model';

export const loadOrders = createAction(
  '[Product] Load Orders',
  props<{ filter: DefaultFilter }>()
);
export const loadOrdersSuccess = createAction(
  '[Product] Load Orders Success',
  props<{ orders: { pager: any; orderList: Order[] } }>()
);
export const loadOrdersFailure = createAction(
  '[Product] Load Orders Failure',
  props<{ error: string }>()
);
export const changeOrderStatusAdmin = createAction(
  '[Product] Change order status admin',
  props<{ changeOrderStatus: ChangeOrderStatusRequest }>()
);
export const changeOrderStatusAdminSuccess = createAction(
  '[Product] Change order status success',
  props<{ changeOrderStatus: ChangeOrderStatusRequest }>()
);
export const changeOrderStatusAdminFailure = createAction(
  '[Product] Change order status failure',
  props<{ error: string }>()
);
