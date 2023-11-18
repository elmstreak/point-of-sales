import { storageSync } from '@larscom/ngrx-store-storagesync';
import {
  Action,
  ActionReducer,
  ActionReducerMap,
  MetaReducer,
  createReducer,
  on,
} from '@ngrx/store';
import * as Actions from './pos-data-access.action';
import { ProductAdminStore } from './pos-data-access.models';
import { size, update } from 'lodash';

const initialState: ProductAdminStore | any = {
  user: {},
  transactions: [],
  products: [],
};

const productReducer = createReducer(
  initialState,
  on(Actions.initializeStore, (state, { initialState }) => ({
    ...initialState,
  })),
  on(Actions.addProduct, (state, { product }) => {
    if (size(state?.products)) {
      return {
        ...state,
        products: [...state?.products, product],
      };
    } else {
      return {
        ...state,
        products: [product],
      };
    }
  }),
  on(Actions.updateProductStore, (state, { updatedState }) => {
    return updatedState;
  })
);

export function productReducers(state: ProductAdminStore, action: Action) {
  return productReducer(state, action);
}

export const reducers: ActionReducerMap<ProductAdminStore> = {
  products: productReducers,
} as any;

export function storageSyncReducer(reducer: ActionReducer<ProductAdminStore>) {
  const metaReducer = storageSync<ProductAdminStore>({
    features: [
      {
        stateKey: 'products',
        storageForFeature: window.sessionStorage,
      },
    ],
    storage: window.sessionStorage,
  });

  return metaReducer(reducer);
}

export const metaReducers: MetaReducer<any>[] = [storageSyncReducer];
