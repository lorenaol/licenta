import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {AuthenticationService} from "../services/authentication.service";



@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private authenticationService: AuthenticationService
  ) { }

  canActivate(route: ActivatedRouteSnapshot,
              state: RouterStateSnapshot) {
    const user = this.authenticationService.userValue;
    if (user) {
      // logged in so return true
      // return true;
      // check if route is restricted by authorities
      if (route.data.authorities && route.data.authorities.indexOf(user.authorities) === -1) {
        // role not authorised so redirect to home page
        this.router.navigate(['/login']);
        return false;
      }
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }
}
