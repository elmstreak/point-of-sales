import { Route } from '@angular/router';
import {
  PRODUCT_FACADE_TOKEN,
  PosCashierComponent,
  PosFeatureShellComponent,
  PosLoginComponent,
  PosSalesComponent,
  PosStocksComponent,
  ProductsFacade,
} from '@org/pos-feature-shell';

export const lazyLoadedRoutes: Route[] = [
  {
    path: '',
    component: PosFeatureShellComponent,
    providers: [ProductsFacade],
  },
  {
    path: 'login',
    component: PosLoginComponent,
  },
  {
    path: 'sales',
    component: PosSalesComponent,
  },
  {
    path: 'stocks',
    component: PosStocksComponent,
  },
  {
    path: 'sales/:date',
    component: PosStocksComponent,
  },
];
