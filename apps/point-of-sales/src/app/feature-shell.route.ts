import { Route } from '@angular/router';
import {
  PosFeatureShellComponent,
  ProductsFacade
} from '@org/pos-feature-shell';

export const lazyLoadedRoutes: Route[] = [
  {
    path: '',
    component: PosFeatureShellComponent,
    providers: [ProductsFacade],
  },
];
