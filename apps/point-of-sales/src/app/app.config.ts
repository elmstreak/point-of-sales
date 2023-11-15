import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { StoreModule, provideState } from '@ngrx/store';
import { ProductsFacade, metaReducers, reducers } from '@org/pos-feature-shell';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes),
    provideAnimations(),
    importProvidersFrom(
      StoreModule.forRoot({ ...reducers }, { metaReducers: metaReducers })
    ),
  ],
};
