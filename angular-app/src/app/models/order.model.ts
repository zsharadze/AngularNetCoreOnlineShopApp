import { OrderItem } from './orderItem.model';
import { OrderStatus } from './orderStatusEnum.model';
import { PromoCode } from './promoCode.model';

export interface Order {
  id: number;
  createdDate: Date | null;
  status: OrderStatus | null;
  subtotal: number | null;
  subtotalWithPromo: number | null;
  userId: string | null;
  userEmail: string | null;
  promoCodeId: number | null;
  promoCode: PromoCode | null;
  orderItems: OrderItem[];
}
