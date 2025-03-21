import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap } from 'rxjs';
import * as AuthActions from '../actions/authActions';
import { AuthService } from './../../services/authService';

@Injectable()
export class AuthEffects {
  constructor(private authService: AuthService) {}

  private actions$ = inject(Actions); //injecting this in constructor caused undefined error.

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap((action) =>
        this.authService.login(action.login).pipe(
          map((loginResponse: any) =>
            AuthActions.loginSuccess({ loginResponse })
          ),
          catchError((error) =>
            of(AuthActions.loginFailure({ error: error.message }))
          )
        )
      )
    )
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap((action) =>
        this.authService.register(action.register).pipe(
          map((register: any) => AuthActions.registerSuccess()),
          catchError((error) =>
            of(AuthActions.registerFailure({ error: error.message }))
          )
        )
      )
    )
  );

  changePassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.changePassword),
      switchMap((action) =>
        this.authService.changePassword(action.changePassword).pipe(
          map((changePassword: any) => AuthActions.changePasswordSuccess()),
          catchError((error) =>
            of(AuthActions.changePasswordFailure({ error: error.message }))
          )
        )
      )
    )
  );

  setAuthenticated$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.setAuthenticated),
        map((action) => {})
      ),
    { dispatch: false } // No new actions will be dispatched
  );

  removeAuthenticatedInfo$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.setUnauthenticated),
        map((action) => {})
      ),
    { dispatch: false } // No new actions will be dispatched
  );
}
