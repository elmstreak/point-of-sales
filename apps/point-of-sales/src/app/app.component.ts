/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
  PRODUCT_FACADE_TOKEN,
  PosCashierComponent,
  PosFeatureShellComponent,
  ProductsFacade,
} from '@org/pos-feature-shell';
import { PosDataAccessService } from 'pos-feature-shell/src/lib/pos-data-access.service';
import { of, switchMap, take } from 'rxjs';
import { MOCK_PRODUCTS, TRANSACTION_MOCK } from './app.mock-data';
import { cloneDeep } from 'lodash';

@Component({
  standalone: true,
  imports: [
    RouterModule,
    StoreModule,
    EffectsModule,
    PosFeatureShellComponent,
    PosCashierComponent,
    HttpClientModule,
  ],
  selector: 'org-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'COMPANY NAME POINT-OF-SALES';

  constructor(
    private productsFacade: ProductsFacade,
    private posService: PosDataAccessService
  ) {
    this.posService
      .getDataFromFile()
      .pipe(
        take(1),
        switchMap((details: any) => {
          if (details?.error) {
            this.productsFacade.initializeApp({
              user: {},
              transactions: [...TRANSACTION_MOCK],
              products: this.convertAllToUpperCase(MOCK_PRODUCTS),
            });
            return this.posService.updateJSON({
              user: {},
              transactions: [...TRANSACTION_MOCK],
              products: this.convertAllToUpperCase(MOCK_PRODUCTS),
            });
          } else {
            this.productsFacade.initializeApp({ ...details.data });
            return of(true);
          }
        })
      )
      .subscribe((response: any) => console.log(response));
  }

  convertAllToUpperCase(products: any) {
    return products.map((productDetails: any) => {
      const details = cloneDeep(productDetails);
      Object.keys(details)?.forEach((productKey: any) => {
        const value = details[productKey];
        if (typeof value === 'string') {
          details[productKey] = value.toUpperCase();
        }
      });
      console.log(details);
      return details;
    });
  }
}
