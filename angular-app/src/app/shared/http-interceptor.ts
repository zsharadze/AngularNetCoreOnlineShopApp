import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, of, switchMap, throwError } from 'rxjs';
import { LoaderService } from '../services/loader.service';
import { showHttpErrorsInToast } from './helpers/show-http-errors-in-toast';
import { ToastrService } from 'ngx-toastr';

export const httpInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
) => {
  const loaderService = inject(LoaderService);
  const toastrService = inject(ToastrService);
  loaderService.show();
  let authToken = localStorage.getItem('token');

  const reqWithHeaders = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${authToken}`),
  });

  return next(reqWithHeaders).pipe(
    catchError((e: HttpErrorResponse) => {
      console.log('error', e);
      showHttpErrorsInToast(toastrService, e);
      return throwError(() => e);
    }),
    finalize(() => loaderService.hide())
  );
};
