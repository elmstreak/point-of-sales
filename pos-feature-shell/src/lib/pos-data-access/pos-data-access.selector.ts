import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductAdminStore } from './pos-data-access.models';

export const selectorProductState =
  createFeatureSelector<ProductAdminStore>('products');

export const getProducts = createSelector(
  selectorProductState,
  (state: ProductAdminStore) => state.products
);

export const getStore = createSelector(
  selectorProductState,
  (state: ProductAdminStore) => state
);
