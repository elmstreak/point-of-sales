import { Route } from '@angular/router';
import {
  PosCashierComponent,
  PosLoginComponent,
  PosSalesComponent,
  PosStocksComponent,
} from '@org/pos-feature-shell';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('./feature-shell.route').then((route) => route.lazyLoadedRoutes),
  },
];
