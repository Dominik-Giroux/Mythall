import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { tap, map, take } from 'rxjs/operators';

@Injectable()
export class OrganisateurGuard implements CanActivate {

  constructor(private auth: AuthenticationService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {

    return this.auth.user.pipe(
      take(1),
      map(user => user && this.auth.isOrganisateur(user) ? true : false),
      tap(isAdmin => {
        if (!isAdmin) {
          console.error('Access Denied - Organisateur Only')
        }
      })
    );

  }
}