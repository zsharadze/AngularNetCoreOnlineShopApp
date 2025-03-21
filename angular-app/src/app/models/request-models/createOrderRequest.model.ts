export interface CreateOrderRequest {
  ordersList: CreateOrderData[];
  promoCode?: string;
}
export interface CreateOrderData {
  productId: number;
  quantity: number;
}
