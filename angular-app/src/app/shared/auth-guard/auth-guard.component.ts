import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthLocalStorageManager } from '../helpers/auth-local-storage-manager';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    let roles = route.data?.['roles'] as Array<string>;
    let userData = AuthLocalStorageManager.getUserData();
    if (
      userData.isAuthenticated &&
      roles.indexOf(userData.userRole!.toString()) > -1
    ) {
      //allowed to see page
      return true;
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
