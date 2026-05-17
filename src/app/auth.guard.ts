import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService, UserRole } from './auth';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    const user = this.authService.currentUser();
    const allowedRoles: UserRole[] = route.data?.roles || [];

    if (!user) {
      return this.router.parseUrl('/login');
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
      return this.router.parseUrl('/login');
    }

    return true;
  }
}
