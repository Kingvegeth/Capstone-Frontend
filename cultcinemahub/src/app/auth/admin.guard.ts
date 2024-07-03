import { Injectable } from '@angular/core';
import {Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard {

  constructor(private authSvc: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authSvc.isAdmin().pipe(
      map(isAdmin => isAdmin || this.router.createUrlTree(['/home']))
    );
  }

  canActivateChild(): Observable<boolean | UrlTree> {
    return this.canActivate();
  }

}
