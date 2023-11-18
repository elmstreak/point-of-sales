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
              transactions: [],
              products: [],
            });
            return this.posService.updateJSON({
              user: {},
              transactions: [],
              products: [],
            });
          } else {
            this.productsFacade.initializeApp({ ...details.data });
            return of(true);
          }
        })
      )
      .subscribe({
        next: (details: any) => {},
      });
  }
}
