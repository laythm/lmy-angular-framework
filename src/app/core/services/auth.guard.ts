import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RolesEnum } from '..';

import { AuthenticationService } from '..';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        let roles = route.data.roles as Array<RolesEnum>;
        let currentUser = this.authenticationService.getCurrentUser;
        if (roles != null && roles.length > 0) {

            if (roles != null && roles.length > 0) {
                if (roles.some(r => this.authenticationService.getCurrentUserHasRole(r))) {
                    return true;
                }
            }
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}