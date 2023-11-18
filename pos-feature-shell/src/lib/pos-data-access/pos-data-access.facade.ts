import { Injectable, InjectionToken } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as Actions from './pos-data-access.action';
import { Product, ProductAdminStore } from './pos-data-access.models';
import * as Selector from './pos-data-access.selector';

export const PRODUCT_FACADE_TOKEN = new InjectionToken<any>(
  'PRODUCTS_FACADE_TOKEN'
);

@Injectable({
  providedIn: 'any',
})
export class ProductsFacade {
  store$ = this.store.pipe(select(Selector.getStore));
  products$ = this.store.pipe(select(Selector.getProducts));
  transactions$ = this.store.pipe(select(Selector.getTransactions));

  addProduct(product: Product): any {
    return this.store.dispatch(Actions.addProduct({ product }));
  }

  updateProductStore(updatedState: ProductAdminStore): any {
    return this.store.dispatch(Actions.updateProductStore({ updatedState }));
  }

  initializeApp(initialState: any): any {
    return this.store.dispatch(Actions.initializeStore({ initialState }));
  }
  constructor(private store: Store) {}
}
