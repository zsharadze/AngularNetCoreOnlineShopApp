import { Injectable } from '@angular/core';
import { ShoppingCartItem } from '../../models/shoppingCartItem.model';
import * as ShoppingCartActions from '../../store/actions/shoppingCartActions';
import { AppState } from '../../store/store';
import { Store } from '@ngrx/store';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Injectable()
export class ShoppingCartLocalStorageManager {
  constructor() {}

  static getShoppingCartItemsAndFillStore(
    store: Store<AppState>,
    productService: ProductService
  ) {
    let shoppingCartArrayObject = localStorage.getItem(
      'shoppingCartArrayObject'
    );
    if (shoppingCartArrayObject) {
      let shoppCartArray = JSON.parse(
        shoppingCartArrayObject
      ) as ShoppingCartItem[];

      let productIds = shoppCartArray.map((x) => x.productId);
      let productIdsFormData = new FormData();
      productIdsFormData.append('ids', JSON.stringify(productIds));
      //getting products to ensure that items in shopping cart have correct price and other info
      productService
        .getProductsByIds(productIdsFormData)
        .subscribe((resProducts: Product[]) => {
          //determine which products was deleted from database after saving shoppingCartItems in local storage and exlude them from shoppCartArray
          const resProductsIds = resProducts.map(({ id }) => id);
          shoppCartArray = shoppCartArray.filter(({ productId }) =>
            resProductsIds.includes(productId)
          );
          for (let element of shoppCartArray) {
            let productFromRes = resProducts.find(
              (x) => x.id == element.productId
            );
            if (!productFromRes) continue;
            element.name = productFromRes.name;
            element.description = productFromRes.description;
            element.imageName = productFromRes.imageName!;
            element.unitPrice = productFromRes.price!;
            element.totalPrice = element.unitPrice * element.quantity;
          }

          store.dispatch(
            ShoppingCartActions.setShoppingCartArray({
              shoppingCartItems: [...shoppCartArray],
            })
          );
        });
    }
  }

  static setShoppingCartItems(shoppingCartItems: ShoppingCartItem[]) {
    localStorage.setItem(
      'shoppingCartArrayObject',
      JSON.stringify(shoppingCartItems)
    );
  }

  static clearShoppingCartItems() {
    localStorage.removeItem('shoppingCartArrayObject');
  }
}
