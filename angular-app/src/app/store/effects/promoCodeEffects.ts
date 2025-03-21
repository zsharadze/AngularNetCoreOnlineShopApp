import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import * as PromoCodeActions from '../actions/pomoCodeActions';
import { PromoCodeService } from '../../services/promoCode.service';
import { getPagerFromHeaders } from '../../shared/helpers/pager-from-headers-creator';
import { PromoCode } from '../../models/promoCode.model';

@Injectable()
export class PromoCodeEffects {
  constructor(private promoCodeService: PromoCodeService) {}

  private actions$ = inject(Actions); //injecting this in constructor caused undefined error.

  loadPromoCodes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromoCodeActions.loadPromoCodes),
      switchMap((action) =>
        this.promoCodeService.getAllPromoCodes(action.filter).pipe(
          map((promoCodesResponse: any) => {
            let pager = getPagerFromHeaders(promoCodesResponse.headers);
            let promoCodesObject: { pager: any; promoCodeList: PromoCode[] } = {
              pager: pager,
              promoCodeList: promoCodesResponse.body,
            };
            return PromoCodeActions.loadPromoCodesSuccess({ promoCodes: promoCodesObject });
          }),
          catchError((error) =>
            of(PromoCodeActions.loadPromoCodesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deletePromoCode$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PromoCodeActions.deletePromoCode),
      switchMap((action) =>
        this.promoCodeService.deletePromoCodeById(action.id).pipe(
          map(() => PromoCodeActions.deletePromoCodeSuccess({ id: action.id })),
          catchError((error) =>
            of(PromoCodeActions.deletePromoCodeFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
