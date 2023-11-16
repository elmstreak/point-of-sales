import { createAction, props } from '@ngrx/store';
import { Product, ProductAdminStore } from './pos-data-access.models';

export enum PointOfSalesActions {
  ADD_PRODUCT = '[POS] Search POS products',
  INITIALIZE = '[POS] Initialize POS',
}

export const initializeStore = createAction(
  PointOfSalesActions.INITIALIZE,
  props<{ initialState: ProductAdminStore }>()
);

export const addProduct = createAction(
  PointOfSalesActions.ADD_PRODUCT,
  props<{ product: Product }>()
);
