import { LoginResponseModel } from '../../models/loginResponce.model';

export class AuthLocalStorageManager {
  static saveUserDataAfterLogin(loginResponse: LoginResponseModel) {
    localStorage.setItem('token', loginResponse.token);
    localStorage.setItem('tokenExpiration', loginResponse.tokenExpiration);
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', loginResponse.userRole);
    localStorage.setItem('userEmail', loginResponse.userEmail);
  }

  //used to retrieve user data from store
  static getUserData() {
    let tmpIsAuthed = localStorage.getItem('isAuthenticated');
    let isAuthenticated = (tmpIsAuthed && tmpIsAuthed == 'true') as boolean;
    return {
      token: localStorage.getItem('token'),
      tokenExpiration: localStorage.getItem('tokenExpiration'),
      isAuthenticated: isAuthenticated,
      userRole: localStorage.getItem('userRole'),
      userEmail: localStorage.getItem('userEmail'),
    };
  }

  static removeUserData() {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
  }
}
