import { createReducer, on } from '@ngrx/store';
import { Product } from '../../models/product.model';
import * as ProductActions from '../actions/productActions';

export interface ProductState {
  products: { pager: any; productList: Product[] | undefined | null };
  product: Product;
  loading: boolean;
  error: string;
}
export const initialState: ProductState = {
  products: { pager: null, productList: null },
  product: {
    id: 0,
    categoryId: null,
    name: '',
    description: '',
    price: null,
    categoryName: null,
    imageName: '',
    createdDate: null,
    images: [],
    ordersCount: null,
  },
  loading: false,
  error: '',
};
export const productReducer = createReducer(
  initialState,

  on(ProductActions.loadProducts, (state) => ({
    ...state,
    loading: true,
  })),
  on(ProductActions.loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    loading: false,
  })),
  on(ProductActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(ProductActions.loadProduct, (state) => ({
    ...state,
    loading: true,
  })),
  on(ProductActions.loadProductSuccess, (state, { product }) => ({
    ...state,
    product,
    loading: false,
  })),
  on(ProductActions.loadProductFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(ProductActions.addProduct, (state, { product }) => ({
    ...state,
    loading: true,
  })),
  on(ProductActions.addProductSuccess, (state, { product }) => ({
    ...state,
    products: {
      pager: { ...state.products.pager },
      productList: [...(state.products.productList as Product[]), product],
    },
    loading: false,
  })),
  on(ProductActions.addProductFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),

  on(ProductActions.updateProduct, (state, { product }) => ({
    ...state,
    loading: true,
  })),
  on(ProductActions.updateProductSuccess, (state, { product }) => ({
    ...state,
    products: {
      pager: { ...state.products.pager },
      productList: state.products?.productList?.map((p: Product) =>
        p.id === product.id ? { ...product } : p
      ),
    },
    product: { ...initialState.product },
    loading: false,
  })),
  on(ProductActions.updateProductFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(ProductActions.deleteProduct, (state, { id }) => ({
    ...state,
    loading: true,
  })),
  on(ProductActions.deleteProductSuccess, (state, { id }) => ({
    ...state,
    products: {
      pager: { ...state.products.pager },
      productList: state.products?.productList?.filter(
        (p: Product) => p.id !== id
      ),
    },
    product: { ...initialState.product },
    loading: false,
  })),
  on(ProductActions.deleteProductFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  }))
);
