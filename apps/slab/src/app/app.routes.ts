/* eslint-disable @typescript-eslint/no-explicit-any */
import { Route } from '@angular/router';
import { SlabProductsComponent } from '@org/slab-feature-shell';

export const appRoutes: Route[] = [
  {
    path: '**',
    redirectTo: 'products',
  },
  {
    path: 'products',
    component: SlabProductsComponent,
  },
];
