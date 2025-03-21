import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import * as CategoryActions from '../actions/categoryActions';
import { CategoryService } from './../../services/category.service';
import { getPagerFromHeaders } from '../../shared/helpers/pager-from-headers-creator';
import { Category } from '../../models/category.model';

@Injectable()
export class CategoryEffects {
  constructor(private categoryService: CategoryService) {}

  private actions$ = inject(Actions); //injecting this in constructor caused undefined error.

  loadCategories$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.loadCategories),
      switchMap((action) =>
        this.categoryService.getAllCategories(action.filter).pipe(
          map((categoryResponse: any) => {
            let pager = getPagerFromHeaders(categoryResponse.headers);
            let categoriesObject: { pager: any; categoryList: Category[] } = {
              pager: pager,
              categoryList: categoryResponse.body,
            };
            return CategoryActions.loadCategoriesSuccess({
              categories: categoriesObject,
            });
          }),
          catchError((error) =>
            of(CategoryActions.loadCategoriesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  loadCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.loadCategory),
      switchMap((action) =>
        this.categoryService.getCategoryById(action.id).pipe(
          map((category: any) =>
            CategoryActions.loadCategorySuccess({ category })
          ),
          catchError((error) =>
            of(CategoryActions.loadCategoryFailure({ error: error.message }))
          )
        )
      )
    )
  );

  deleteCategory$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CategoryActions.deleteCategory),
      switchMap((action) =>
        this.categoryService.deleteCategoryById(action.id).pipe(
          map(() => CategoryActions.deleteCategorySuccess({ id: action.id })),
          catchError((error) =>
            of(CategoryActions.deleteCategoryFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
