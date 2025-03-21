import { createAction, props } from '@ngrx/store';
import { CategoryListFilter } from '../../models/filters/category-list-filter.model';
import { Category } from '../../models/category.model';

export const loadCategories = createAction(
  '[Category] Load Categories',
  props<{ filter: CategoryListFilter }>()
);
export const loadCategoriesSuccess = createAction(
  '[Category] Load Categories Success',
  props<{ categories: { pager: any; categoryList: Category[] } }>()
);
export const loadCategoriesFailure = createAction(
  '[Category] Load Categories Failure',
  props<{ error: string }>()
);

export const loadCategory = createAction(
  '[Category] Load Category',
  props<{ id: number }>()
);
export const loadCategorySuccess = createAction(
  '[Category] Load Product Success',
  props<{ category: Category }>()
);
export const loadCategoryFailure = createAction(
  '[Category] Load Category Failure',
  props<{ error: string }>()
);

export const deleteCategory = createAction(
  '[Category] Delete Category',
  props<{ id: number }>()
);
export const deleteCategorySuccess = createAction(
  '[Category] Delete Category Success',
  props<{ id: number }>()
);
export const deleteCategoryFailure = createAction(
  '[Category] Delete Category Failure',
  props<{ error: string }>()
);