import { Injectable } from '@angular/core';
import { Router, UrlTree} from '@angular/router';
import { Observable, map } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotAdminGuard {
  constructor(private authSvc: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authSvc.isAdmin().pipe(
      map(isAdmin => !isAdmin || this.router.createUrlTree(['/home']))
    );
  }

  canActivateChild(): Observable<boolean | UrlTree> {
    return this.canActivate();
  }

}
