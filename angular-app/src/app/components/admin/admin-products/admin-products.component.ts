import { Component, ViewChild } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppState } from '../../../store/store';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { ProductListFilter } from '../../../models/filters/product-list-filter.model';
import { Product } from '../../../models/product.model';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subject,
  takeUntil,
} from 'rxjs';
import { environment } from '../../../../environments/environment';
import * as ProductActions from '../../../store/actions/productActions';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { CommonModule } from '@angular/common';
import { ModalDialogComponent } from '../../shared/modal-dialog/modal-dialog.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    PaginationComponent,
    ModalDialogComponent,
  ],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css',
})
export class AdminProductsComponent {
  urlProductImages = environment.PRODUCT_IMAGES_URL;
  productsState$: Observable<{
    pager: any;
    productList: Product[] | undefined | null;
  }>;
  public searchTextChanged: Subject<string> = new Subject<string>();
  private unsubscribe$ = new Subject<string>();
  filter: ProductListFilter = {
    categoryId: null,
    searchText: '',
    pageIndex: 1,
    pageSize: 10,
  };
  @ViewChild(ModalDialogComponent) modalDialogChild!: ModalDialogComponent;
  constructor(private store: Store<AppState>, private actions$: Actions) {
    this.productsState$ = this.store.select((state) => state.product.products);
  }

  ngOnInit() {
    this.actions$
      .pipe(ofType(ProductActions.loadProductsSuccess))
      .subscribe((data: any) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    this.getProducts();
    this.searchTextChanged
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntil(this.unsubscribe$)
      )
      .subscribe((searchText: string) => {
        this.filter = { ...this.filter, searchText };
        this.getProducts();
      });
  }

  getProducts() {
    this.store.dispatch(ProductActions.loadProducts({ filter: this.filter }));
  }

  showDeleteConfirmModal(id: number) {
    this.modalDialogChild.showModal(id);
  }

  deleteProduct(productId: number) {
    this.store.dispatch(
      ProductActions.deleteProduct({
        id: productId,
      })
    );
  }

  pageIndexChanged(page: number) {
    this.filter = { ...this.filter, pageIndex: page };
    this.getProducts();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next('unsubscribe emit');
    this.unsubscribe$.complete();
    this.searchTextChanged.unsubscribe();
  }
}
