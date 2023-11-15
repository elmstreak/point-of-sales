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

@Component({
  standalone: true,
  imports: [
    RouterModule,
    StoreModule,
    EffectsModule,
    PosFeatureShellComponent,
    PosCashierComponent,
  ],
  selector: 'org-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'COMPANY NAME POINT-OF-SALES';

  constructor() {}
}
