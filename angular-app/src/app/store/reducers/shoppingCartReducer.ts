import { createReducer, on } from '@ngrx/store';
import * as ShoppingCartActions from '../actions/shoppingCartActions';
import { ShoppingCartItem } from '../../models/shoppingCartItem.model';
import { inject } from '@angular/core';
import { ShoppingCartLocalStorageManager } from '../../shared/helpers/shopping-cart-local-storage-manager';

export interface ShoppingCartState {
  shoppingCart: ShoppingCartItem[];
  loading: boolean;
  error: string;
}
export const initialState: ShoppingCartState = {
  shoppingCart: [],
  loading: false,
  error: '',
};

export const shoppingCartReducer = createReducer(
  initialState,

  on(ShoppingCartActions.addOrUpdateCart, (state, { shoppingCartItem }) => {
    let shoppingCartArray: ShoppingCartItem[] = [];
    shoppingCartArray = shoppingCartArray.concat(state.shoppingCart);

    let foundIndex = shoppingCartArray.findIndex(
      (x) => x.productId === shoppingCartItem.productId
    );
    if (shoppingCartArray.length === 0 || foundIndex === -1) {
      shoppingCartArray.push({
        ...shoppingCartItem,
        totalPrice: shoppingCartItem.unitPrice! * shoppingCartItem.quantity!,
      });
    } else {
      if (foundIndex > -1) {
        shoppingCartArray[foundIndex] = {
          ...shoppingCartArray[foundIndex],
          quantity: shoppingCartItem.quantity,
          unitPrice: shoppingCartItem.unitPrice,
          totalPrice: shoppingCartItem.unitPrice! * shoppingCartItem.quantity!,
        };
      }
    }
    ShoppingCartLocalStorageManager.setShoppingCartItems([
      ...shoppingCartArray,
    ]);
    return {
      ...state,
      shoppingCart: [...shoppingCartArray],
      loading: false,
    };
  }),
  on(
    ShoppingCartActions.setShoppingCartArray,
    (state, { shoppingCartItems }) => {
      return {
        ...state,
        shoppingCart: [...shoppingCartItems],
        loading: false,
      };
    }
  ),
  on(
    ShoppingCartActions.changeQuantityInCart,
    (state, { productId, quantity }) => {
      let shoppingCartArray: ShoppingCartItem[] = [...state.shoppingCart];

      let foundIndex = shoppingCartArray.findIndex(
        (x) => x.productId === productId
      );
      if (foundIndex > -1) {
        shoppingCartArray[foundIndex] = {
          ...shoppingCartArray[foundIndex],
          quantity: quantity,
          totalPrice: shoppingCartArray[foundIndex]?.unitPrice! * quantity,
        };
      }
      ShoppingCartLocalStorageManager.setShoppingCartItems([
        ...shoppingCartArray,
      ]);
      return {
        ...state,
        shoppingCart: [...shoppingCartArray],
        loading: false,
      };
    }
  ),
  on(ShoppingCartActions.removeItemFromCart, (state, { productId }) => {
    let shoppingCartArray: ShoppingCartItem[] = [...state.shoppingCart];

    let foundIndex = state.shoppingCart.findIndex(
      (x) => x.productId === productId
    );

    shoppingCartArray.splice(foundIndex, 1);

    ShoppingCartLocalStorageManager.setShoppingCartItems([
      ...shoppingCartArray,
    ]);

    return {
      ...state,
      shoppingCart: [...shoppingCartArray],
      loading: false,
    };
  }),
  on(ShoppingCartActions.clearShoppingCart, (state: any) => {
    ShoppingCartLocalStorageManager.clearShoppingCartItems();
    return {
      ...state,
      ...initialState,
      loading: false,
    };
  })
);
