import { createReducer, on } from '@ngrx/store';
import * as OrderActions from '../actions/orderActions';
import { Order } from '../../models/order.model';

export interface OrderState {
  orders: { pager: any; orderList: Order[] | undefined | null };
  order: Order;
  loading: boolean;
  error: string;
}
export const initialState: OrderState = {
  orders: { pager: null, orderList: null },
  order: {
    id: 0,
    createdDate: null,
    orderItems: [],
    promoCode: null,
    promoCodeId: null,
    status: null,
    subtotal: null,
    subtotalWithPromo: null,
    userEmail: null,
    userId: null,
  },
  loading: false,
  error: '',
};
export const orderReducer = createReducer(
  initialState,

  on(OrderActions.loadOrders, (state) => ({
    ...state,
    loading: true,
  })),
  on(OrderActions.loadOrdersSuccess, (state, { orders }) => ({
    ...state,
    orders,
    loading: false,
  })),
  on(OrderActions.loadOrdersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(OrderActions.changeOrderStatusAdmin, (state) => ({
    ...state,
    loading: true,
  })),
  on(
    OrderActions.changeOrderStatusAdminSuccess,
    (state, { changeOrderStatus }) => ({
      ...state,
      orders: {
        pager: { ...state.orders.pager },
        orderList: state.orders?.orderList?.map((o: Order) =>
          o.id === changeOrderStatus.orderId
            ? { ...o, status: changeOrderStatus.newStatus }
            : o
        ),
      },
      loading: false,
    })
  ),
  on(OrderActions.changeOrderStatusAdminFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
