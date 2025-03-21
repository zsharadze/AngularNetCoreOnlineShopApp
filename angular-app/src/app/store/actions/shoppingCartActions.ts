import { createAction, props } from '@ngrx/store';
import { ShoppingCartItem } from '../../models/shoppingCartItem.model';

export const addOrUpdateCart = createAction(
  '[ShoppingCart] AddOrUpdateCart',
  props<{ shoppingCartItem: ShoppingCartItem }>()
);

export const changeQuantityInCart = createAction(
  '[ShoppingCart] ChangeQuantityInCart',
  props<{ productId: number; quantity: number }>()
);

export const setShoppingCartArray = createAction(
  '[ShoppingCart] SetShoppingCartArray',
  props<{ shoppingCartItems: ShoppingCartItem[] }>()
);

export const removeItemFromCart = createAction(
  '[ShoppingCart] RemoveItemFromCart',
  props<{ productId: number }>()
);

export const clearShoppingCart = createAction(
  '[ShoppingCart] ClearShoppingCart'
);