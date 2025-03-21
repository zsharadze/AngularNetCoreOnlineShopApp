import { Product } from './product.model';

export interface OrderItem {
  id: number;
  quantity: number;
  productId: number;
  product: Product;
}
