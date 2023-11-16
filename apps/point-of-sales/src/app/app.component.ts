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
import { take } from 'rxjs';

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
      .pipe(take(1))
      .subscribe({
        next: (details: any) => {
          if (details?.error) {
            this.productsFacade.initializeApp({
              user: {},
              transactions: [],
              products: [],
            });
            this.posService
              .updateProduct({
                user: {},
                transactions: [],
                products: [],
              })
              .subscribe(() => {});
          } else {
            this.productsFacade.initializeApp({ ...details.data });
          }
        },
      });
  }
}
