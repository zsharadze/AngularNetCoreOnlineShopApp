import { Directive, ElementRef, Input } from '@angular/core';
import { OrderStatus } from '../../models/orderStatusEnum.model';
import { throwError } from 'rxjs';
@Directive({
  selector: '[changeBGOnOrderStatus]',
  standalone: true,
})
export class ChangeBGOnOrderStatus {
  @Input() orderStatus: any = 0;
  constructor(private el: ElementRef) {}

  ngOnInit() {
    switch (Number(this.orderStatus)) {
      case Number(OrderStatus.Pending):
        this.el.nativeElement.classList.add('bg-primary');
        break;
      case Number(OrderStatus.Shipped):
        this.el.nativeElement.classList.add('bg-warning');
        this.el.nativeElement.classList.add('text-dark');
        break;
      case Number(OrderStatus.Completed):
        this.el.nativeElement.classList.add('bg-success');
        break;
        case Number(OrderStatus.Canceled):
        this.el.nativeElement.classList.add('bg-danger');
        break;
      default: {
        throwError(() => new Error('invalid order status'));
      }
    }
  }
}
