import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LoginModel } from './../models/login.model';
import { RegisterModel } from './../models/register.model';
import { ChangePasswordModel } from '../models/changePassword.model';

@Injectable()
export class AuthService {
  apiUrl = environment.API_URL;
  constructor(private http: HttpClient) {
    this.http = http;
  }

  login(loginModel: LoginModel) {
    return this.http.post(this.apiUrl + '/authenticate/login', loginModel);
  }

  register(registerModel: RegisterModel) {
    return this.http.post(
      this.apiUrl + '/authenticate/register',
      registerModel
    );
  }

  changePassword(changePasswordModel: ChangePasswordModel) {
    return this.http.post(
      this.apiUrl + '/authenticate/changepassword',
      changePasswordModel
    );
  }
}
