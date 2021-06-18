import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { AuthenticationService } from '../authentication.service';

@Injectable()
export class AnimateurGuard implements CanActivate {

  constructor(
    private auth: AuthenticationService
  ) { }

  public async canActivate(): Promise<boolean> {
    return this.auth.isAnimateur(await this.auth.user());
    // of(this.auth.user && this.auth.isAnimateur(this.auth.user)).pipe(
    //   tap(isAdmin => {
    //     if (!isAdmin) {
    //       console.error('Access Denied - Animateur Only')
    //     }
    //   })
    // );

  }
}