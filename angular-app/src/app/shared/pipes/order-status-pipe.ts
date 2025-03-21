import { Pipe, PipeTransform } from '@angular/core';
import { OrderStatus } from '../../models/orderStatusEnum.model';

@Pipe({
  name: 'orderStatus',
  standalone: true,
  pure: true,
})
export class OrderStatusPipe implements PipeTransform {
  transform(value: number | null): string {
    return OrderStatus[Number(value)].toString();
  }
}
