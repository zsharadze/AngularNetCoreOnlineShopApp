import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { PromoCode } from '../../../models/promoCode.model';
import { PromoCodeListFilter } from '../../../models/filters/promo-code-list-filter.model';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store/store';
import { Actions, ofType } from '@ngrx/effects';
import * as PromoCodeActions from './../../../store/actions/pomoCodeActions';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { FormsModule } from '@angular/forms';
import { PromoCodeService } from '../../../services/promoCode.service';

@Component({
  selector: 'app-admin-promo-codes',
  standalone: true,
  imports: [CommonModule, PaginationComponent, FormsModule],
  templateUrl: './admin-promo-codes.component.html',
  styleUrl: './admin-promo-codes.component.css',
})
export class AdminPromoCodesComponent {
  promoCodesState$: Observable<{
    pager: any;
    promoCodeList: PromoCode[] | undefined | null;
  }>;
  filter: PromoCodeListFilter = {
    userEmail: '',
    pageIndex: 1,
    pageSize: 10,
  };
  generationParams = {
    quantity: 1,
    discount: 50,
  };
  public searchTextChanged: Subject<string> = new Subject<string>();
  private unsubscribe$ = new Subject<string>();
  constructor(
    private store: Store<AppState>,
    private actions$: Actions,
    private promoCodeService: PromoCodeService
  ) {
    this.promoCodesState$ = this.store.select(
      (state) => state.promoCode.promoCodes
    );
  }

  ngOnInit() {
    this.actions$
      .pipe(ofType(PromoCodeActions.loadPromoCodesSuccess))
      .subscribe((data: any) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    this.getPromoCodes();
    this.searchTextChanged
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((userEmail: string) => {
        this.filter = { ...this.filter, userEmail };
        this.getPromoCodes();
      });
  }

  getPromoCodes() {
    this.store.dispatch(
      PromoCodeActions.loadPromoCodes({ filter: this.filter })
    );
  }

  generatePromoCodes() {
    this.promoCodeService
      .generatePromoCodes(
        this.generationParams.quantity,
        this.generationParams.discount
      )
      .subscribe((res) => {
        this.getPromoCodes();
      });
  }

  pageIndexChanged(page: number) {
    this.filter = { ...this.filter, pageIndex: page };
    this.getPromoCodes();
  }

  deletePromoCode(promoCodeId: number) {
    this.store.dispatch(
      PromoCodeActions.deletePromoCode({
        id: promoCodeId,
      })
    );
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next('unsubscribe emit');
    this.unsubscribe$.complete();
    this.searchTextChanged.unsubscribe();
  }
}
