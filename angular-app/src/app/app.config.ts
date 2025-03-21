import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from './shared/http-interceptor';
import { provideAnimations } from '@angular/platform-browser/animations';

import { provideToastr, ToastrService } from 'ngx-toastr';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { appEffects, appStore } from './store/store';
import { ProductService } from './services/product.service';
import { CategoryService } from './services/category.service';
import { AuthService } from './services/authService';
import { OrderService } from './services/order.service';
import { PromoCodeService } from './services/promoCode.service';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore(appStore),
    provideEffects(appEffects),
    provideHttpClient(withInterceptors([httpInterceptor])),
    provideAnimations(),
    provideToastr(), //Toastr providers
    ProductService,
    CategoryService,
    AuthService,
    OrderService,
    PromoCodeService
  ],
};
