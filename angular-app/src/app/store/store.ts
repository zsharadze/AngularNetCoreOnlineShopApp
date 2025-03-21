import { Action, ActionReducer } from '@ngrx/store';
import { ProductState, productReducer } from './reducers/productReducer';
import { ProductEffects } from '././effects/productEffects';
import { categoryReducer, CategoryState } from './reducers/categoryReducer';
import { CategoryEffects } from './effects/categoryEffects';
import {
  shoppingCartReducer,
  ShoppingCartState,
} from './reducers/shoppingCartReducer';
import { AuthEffects } from './effects/authEffects';
import { authReducer, AuthState } from './reducers/authReducer';
import { orderReducer, OrderState } from './reducers/orderReducer';
import { OrderEffects } from './effects/orderEffects';
import { promoCodeReducer, PromoCodeState } from './reducers/promoCodeReducer';
import { PromoCodeEffects } from './effects/promoCodeEffects';

export interface AppState {
  product: ProductState;
  category: CategoryState;
  shoppingCart: ShoppingCartState;
  auth: AuthState;
  order: OrderState;
  promoCode: PromoCodeState;
}

export interface AppStore {
  product: ActionReducer<ProductState, Action>;
  category: ActionReducer<CategoryState, Action>;
  shoppingCart: ActionReducer<ShoppingCartState, Action>;
  auth: ActionReducer<AuthState, Action>;
  order: ActionReducer<OrderState, Action>;
  promoCode: ActionReducer<PromoCodeState, Action>;
}

export const appStore: AppStore = {
  product: productReducer,
  category: categoryReducer,
  shoppingCart: shoppingCartReducer,
  auth: authReducer,
  order: orderReducer,
  promoCode: promoCodeReducer,
};

export const appEffects = [
  ProductEffects,
  CategoryEffects,
  AuthEffects,
  OrderEffects,
  PromoCodeEffects,
];
