import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutes } from './routes/app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom(HttpClient, ReactiveFormsModule),
    provideRouter(AppRoutes),
  ],
};
