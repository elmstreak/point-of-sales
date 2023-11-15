import { Injectable, InjectionToken } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as Actions from './pos-data-access.action';
import { Product } from './pos-data-access.models';
import * as Selector from './pos-data-access.selector';

export const PRODUCT_FACADE_TOKEN = new InjectionToken<any>(
  'PRODUCTS_FACADE_TOKEN'
);

@Injectable({
  providedIn: 'any',
})
export class ProductsFacade {
  products$ = this.store.pipe(select(Selector.getProducts));

  addProduct(product: Product): any {
    return this.store.dispatch(Actions.addProduct({ product }));
  }
  initializeApp(): any {
    return this.store.dispatch(Actions.initializeStore());
  }
  constructor(private store: Store) {}
}
