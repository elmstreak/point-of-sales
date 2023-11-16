import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { StoreModule, provideState } from '@ngrx/store';
import { ProductsFacade, metaReducers, reducers } from '@org/pos-feature-shell';
import { environment } from '../environment';
import { PosDataAccessService } from 'pos-feature-shell/src/lib/pos-data-access.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideAnimations(),
    importProvidersFrom(
      StoreModule.forRoot({ ...reducers }, { metaReducers: metaReducers })
    ),
    {
      provide: 'environment',
      useValue: environment,
    },
    ProductsFacade,
  ],
};
