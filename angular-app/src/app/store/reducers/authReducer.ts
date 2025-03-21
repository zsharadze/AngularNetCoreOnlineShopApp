import { createReducer, on } from '@ngrx/store';
import * as AuthActions from '../actions/authActions';
import { AuthLocalStorageManager } from '../../shared/helpers/auth-local-storage-manager';

export interface AuthState {
  userEmail: string;
  userRole: string;
  isAuthenticated: boolean;
  loading: boolean;
  error: string;
}
export const initialState: AuthState = {
  userEmail: '',
  userRole: '',
  isAuthenticated: false,
  loading: false,
  error: '',
};
export const authReducer = createReducer(
  initialState,

  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
  })),
  on(AuthActions.loginSuccess, (state, { loginResponse }) => {
    AuthLocalStorageManager.saveUserDataAfterLogin(loginResponse);
    return {
      ...state,
      userEmail: loginResponse.userEmail,
      userRole: loginResponse.userRole,
      isAuthenticated: true,
      loading: false,
    };
  }),
  on(AuthActions.loginFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(AuthActions.setAuthenticated, (state: any) => {
    let userData = AuthLocalStorageManager.getUserData();
    return {
      ...state,
      userEmail: userData.userEmail,
      userRole: userData.userRole,
      isAuthenticated: true,
      loading: false,
    };
  }),
  on(AuthActions.setUnauthenticated, (state: any) => {
    AuthLocalStorageManager.removeUserData();
    return {
      ...state,
      ...initialState,
    };
  })
);
