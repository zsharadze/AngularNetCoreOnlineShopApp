import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import * as ProductActions from '../actions/productActions';
import { ProductService } from './../../services/product.service';
import { getPagerFromHeaders } from '../../shared/helpers/pager-from-headers-creator';
import { Product } from '../../models/product.model';

@Injectable()
export class ProductEffects {
  constructor(private productService: ProductService) {}

  private actions$ = inject(Actions); //injecting this in constructor caused undefined error.

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProducts),
      switchMap((action) =>
        this.productService.getAllProducts(action.filter).pipe(
          map((productsResponse: any) => {
            let pager = getPagerFromHeaders(productsResponse.headers);
            let productsObject: { pager: any; productList: Product[] } = {
              pager: pager,
              productList: productsResponse.body,
            };
            return ProductActions.loadProductsSuccess({
              products: productsObject,
            });
          }),
          catchError((error) =>
            of(ProductActions.loadProductsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.loadProduct),
      switchMap((action) =>
        this.productService.getProductById(action.id).pipe(
          map((product: any) => ProductActions.loadProductSuccess({ product })),
          catchError((error) =>
            of(ProductActions.loadProductFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductActions.deleteProduct),
      switchMap((action) =>
        this.productService.deleteProductById(action.id).pipe(
          map(() => ProductActions.deleteProductSuccess({ id: action.id })),
          catchError((error) =>
            of(ProductActions.deleteProductFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
