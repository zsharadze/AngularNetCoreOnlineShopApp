import { createReducer, on } from '@ngrx/store';
import { Category } from '../../models/category.model';
import * as CategoryActions from '../actions/categoryActions';

export interface CategoryState {
  categories: { pager: any; categoryList: Category[] | undefined | null };
  loading: boolean;
  error: string;
}
export const initialState: CategoryState = {
  categories: { pager: null, categoryList: null },
  loading: false,
  error: '',
};
export const categoryReducer = createReducer(
  initialState,

  on(CategoryActions.loadCategories, (state) => ({
    ...state,
    loading: true,
  })),
  on(CategoryActions.loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    categories,
    loading: false,
  })),
  on(CategoryActions.loadCategoriesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(CategoryActions.deleteCategory, (state, { id }) => ({
    ...state,
    loading: true,
  })),
  on(CategoryActions.deleteCategorySuccess, (state, { id }) => ({
    ...state,
    categories: {
      pager: { ...state.categories.pager },
      categoryList: state.categories?.categoryList?.filter(
        (c: Category) => c.id !== id
      ),
    },
    loading: false,
  })),
  on(CategoryActions.deleteCategoryFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
