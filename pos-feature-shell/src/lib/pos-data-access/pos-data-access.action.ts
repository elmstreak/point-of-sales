import { createAction, props } from '@ngrx/store';
import { Product, ProductAdminStore } from './pos-data-access.models';

export enum PointOfSalesActions {
  ADD_PRODUCT = '[POS] Search POS products',
  INITIALIZE = '[POS] Initialize POS',
  UPDATE_PRODUCT_STORE = '[POS] Update Product store',
}

export const initializeStore = createAction(
  PointOfSalesActions.INITIALIZE,
  props<{ initialState: ProductAdminStore }>()
);

export const addProduct = createAction(
  PointOfSalesActions.ADD_PRODUCT,
  props<{ product: Product }>()
);

export const updateProductStore = createAction(
  PointOfSalesActions.UPDATE_PRODUCT_STORE,
  props<{ updatedState: ProductAdminStore }>()
);
