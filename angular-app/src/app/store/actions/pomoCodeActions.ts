import { createAction, props } from '@ngrx/store';
import { PromoCodeListFilter } from '../../models/filters/promo-code-list-filter.model';
import { PromoCode } from '../../models/promoCode.model';

export const loadPromoCodes = createAction(
  '[PromoCode] Load PromoCodes',
  props<{ filter: PromoCodeListFilter }>()
);
export const loadPromoCodesSuccess = createAction(
  '[PromoCode] Load PromoCodes Success',
  props<{ promoCodes: { pager: any; promoCodeList: PromoCode[] } }>()
);
export const loadPromoCodesFailure = createAction(
  '[PromoCode] Load PromoCodes Failure',
  props<{ error: string }>()
);

export const deletePromoCode = createAction(
  '[PromoCode] Delete PromoCode',
  props<{ id: number }>()
);
export const deletePromoCodeSuccess = createAction(
  '[PromoCode] Delete PromoCode Success',
  props<{ id: number }>()
);
export const deletePromoCodeFailure = createAction(
  '[PromoCode] Delete PromoCode Failure',
  props<{ error: string }>()
);
