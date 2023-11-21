import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('./feature-shell.route').then((route) => route.lazyLoadedRoutes),
  },
];
