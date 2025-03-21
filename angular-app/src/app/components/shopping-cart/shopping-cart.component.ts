import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from '../shared/header/header.component';
import { Router } from '@angular/router';
import { AppState } from '../../store/store';
import { Store } from '@ngrx/store';
import { ShoppingCartItem } from '../../models/shoppingCartItem.model';
import { firstValueFrom, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from './../../../environments/environment';
import * as ShoppingCartActions from '../../store/actions/shoppingCartActions';
import { PromoCodeService } from '../../services/promoCode.service';
import { ModalDialogComponent } from '../shared/modal-dialog/modal-dialog.component';
import {
  CreateOrderData,
  CreateOrderRequest,
} from '../../models/request-models/createOrderRequest.model';
import { OrderService } from '../../services/order.service';
import { AuthLocalStorageManager } from '../../shared/helpers/auth-local-storage-manager';
import { Location } from '@angular/common';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, ModalDialogComponent],
  providers: [PromoCodeService, OrderService],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.css',
})
export class ShoppingCartComponent {
  urlProductImages = environment.PRODUCT_IMAGES_URL;
  shoppingCart$: Observable<ShoppingCartItem[]>;
  appliedPromoCode = '';
  appliedPromoCodeDiscount = 0;
  @ViewChild(ModalDialogComponent) modalDialogChild!: ModalDialogComponent;
  constructor(
    public router: Router,
    private store: Store<AppState>,
    private promoCodeService: PromoCodeService,
    private orderService: OrderService,
    public location: Location
  ) {
    this.shoppingCart$ = this.store.select(
      (state) => state.shoppingCart.shoppingCart
    );
  }

  onQuantityChange(event: any, productId: number) {
    let quantity = event.target.value;
    this.store.dispatch(
      ShoppingCartActions.changeQuantityInCart({
        productId: productId,
        quantity: Number(quantity),
      })
    );
  }

  getSubTotal(withPromo: boolean) {
    let subTotal = 0;
    this.shoppingCart$.subscribe((res) => {
      subTotal = res.reduce((total, item) => item.totalPrice! + total, 0);
    });

    subTotal = subTotal - (withPromo ? this.appliedPromoCodeDiscount : 0);
    return subTotal <= 0 ? 0 : subTotal;
  }

  deleteItem(productId: number) {
    this.store.dispatch(
      ShoppingCartActions.removeItemFromCart({
        productId: productId,
      })
    );
  }

  applyPromoCode(promoCode: string) {
    this.promoCodeService
      .getByPromoCodeText(promoCode)
      .subscribe((res: any) => {
        if (!res) {
          this.appliedPromoCode = '';
          this.modalDialogChild.showModal();
        } else {
          this.appliedPromoCode = res.promoCodeText;
          this.appliedPromoCodeDiscount = res.discount;
        }
      });
  }

  async placeOrder() {
    if (!AuthLocalStorageManager.getUserData().isAuthenticated) {
      this.router.navigate(['/auth/login']);
      return;
    }
    const shoppingCartItems = (await firstValueFrom(
      this.shoppingCart$
    )) as ShoppingCartItem[];

    let order: CreateOrderRequest = {
      ordersList: shoppingCartItems.map(function (item) {
        return {
          productId: item.productId,
          quantity: item.quantity,
        } as CreateOrderData;
      }),
      promoCode: this.appliedPromoCode,
    };

    this.orderService.createOrder(order).subscribe((res) => {
      this.store.dispatch(ShoppingCartActions.clearShoppingCart());
      this.router.navigate(['/myorders']);
    });
  }
}
