import { createAction, props } from '@ngrx/store';
import { LoginModel } from '../../models/login.model';
import { RegisterModel } from '../../models/register.model';
import { LoginResponseModel } from '../../models/loginResponce.model';
import { ChangePasswordModel } from '../../models/changePassword.model';

export const login = createAction(
  '[Auth] Login',
  props<{ login: LoginModel }>()
);
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ loginResponse: LoginResponseModel }>()
);
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const register = createAction(
  '[Auth] Register',
  props<{ register: RegisterModel }>()
);
export const registerSuccess = createAction(
  '[Auth] Register Success'
);
export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()
);

export const changePassword = createAction(
  '[Auth] ChangePassword',
  props<{ changePassword: ChangePasswordModel }>()
);
export const changePasswordSuccess = createAction(
  '[Auth] ChangePassword Success'
);
export const changePasswordFailure = createAction(
  '[Auth] ChangePassword Failure',
  props<{ error: string }>()
);

export const setAuthenticated = createAction(
  '[Auth] SetAuthenticated'
);

//after logout or after token expired
export const setUnauthenticated = createAction(
  '[Auth] RemoveAuthenticatedInfo'
);