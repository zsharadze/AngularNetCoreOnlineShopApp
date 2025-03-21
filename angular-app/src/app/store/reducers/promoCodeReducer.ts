import { createReducer, on } from '@ngrx/store';
import * as PromoCodeActions from '../actions/pomoCodeActions';
import { PromoCode } from '../../models/promoCode.model';

export interface PromoCodeState {
  promoCodes: { pager: any; promoCodeList: PromoCode[] | undefined | null };
  loading: boolean;
  error: string;
}
export const initialState: PromoCodeState = {
  promoCodes: { pager: null, promoCodeList: null },
  loading: false,
  error: '',
};
export const promoCodeReducer = createReducer(
  initialState,

  on(PromoCodeActions.loadPromoCodes, (state) => ({
    ...state,
    loading: true,
  })),
  on(PromoCodeActions.loadPromoCodesSuccess, (state, { promoCodes }) => ({
    ...state,
    promoCodes,
    loading: false,
  })),
  on(PromoCodeActions.loadPromoCodesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(PromoCodeActions.deletePromoCode, (state, { id }) => ({
    ...state,
    loading: true,
  })),
  on(PromoCodeActions.deletePromoCodeSuccess, (state, { id }) => ({
    ...state,
    promoCodes: {
      pager: { ...state.promoCodes.pager },
      promoCodeList: state.promoCodes?.promoCodeList?.filter(
        (p: PromoCode) => p.id !== id
      ),
    },
    loading: false,
  })),
  on(PromoCodeActions.deletePromoCodeFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
