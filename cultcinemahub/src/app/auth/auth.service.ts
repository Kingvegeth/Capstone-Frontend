import { JwtHelperService } from '@auth0/angular-jwt';
import { Injectable } from '@angular/core';
import { iUser } from '../models/iuser';
import { BehaviorSubject, Observable, catchError, map, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { iLoginData } from '../models/ilogindata';
import { UsersService } from '../users.service';

type AccessData = {
  token: string,
  user: iUser
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  jwtHelper: JwtHelperService = new JwtHelperService();
  private token: string | null = null;

  authSubject = new BehaviorSubject<iUser | null>(null);
  user$ = this.authSubject.asObservable();

  isLoggedIn$ = this.user$.pipe(
    map(user => !!user),
    tap(user => this.syncIsLoggedIn = user)
  );

  syncIsLoggedIn: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router,
    private usersSvc: UsersService
  ) {
    this.restoreUser();
  }

  registerUrl: string = environment.registerUrl;
  loginUrl: string = environment.loginUrl;

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getToken(): string | null {
    if (!this.token) {
      this.token = localStorage.getItem('authToken');
    }
    return this.token;
  }

  register(newUser: Partial<iUser>): Observable<AccessData> {
    return this.http.post<AccessData>(this.registerUrl, newUser).pipe(
      tap(data => {
        this.authSubject.next(data.user);
        this.storeUserData(data.token, data.user);
      }),
      catchError(error => {
        console.error('Registration error:', error);
        throw this.errors(error);
      })
    );
  }

  login(loginData: iLoginData, rememberMe: boolean): Observable<AccessData> {
    return this.http.post<AccessData>(this.loginUrl, loginData).pipe(
      tap(data => {
        this.setToken(data.token);
        if (rememberMe) {
          localStorage.setItem('accessData', JSON.stringify(data));
        } else {
          sessionStorage.setItem('accessData', JSON.stringify(data));
        }
        this.autoLogout(data.token);
        this.loadCurrentUser().subscribe(() => {
          this.router.navigate(['/home']);
        });
      }),
      catchError(error => {
        throw error;
      })
    );
  }

  updateCurrentUser(user: iUser) {
    this.authSubject.next(user);
  }

  loadCurrentUser(): Observable<void> {
    return this.usersSvc.getCurrentUser().pipe(
      tap(user => {
        this.authSubject.next(user);
      }),
      map(() => void 0)
    );
  }

  logout() {
    this.authSubject.next(null);
    localStorage.removeItem('accessData');
    sessionStorage.removeItem('accessData');
    localStorage.removeItem('authToken');
    this.router.navigate(['/auth/login']);
  }

  autoLogout(jwt: string) {
    const expDate = this.jwtHelper.getTokenExpirationDate(jwt) as Date;
    const expMs = expDate.getTime() - new Date().getTime();
    setTimeout(() => {
      this.logout();
    }, expMs);
  }

  restoreUser() {
    let userJson = localStorage.getItem('accessData') || sessionStorage.getItem('accessData');
    if (!userJson) return;

    const accessData: AccessData = JSON.parse(userJson);
    if (this.jwtHelper.isTokenExpired(accessData.token)) return;

    this.authSubject.next(accessData.user);
    this.setToken(accessData.token);
    this.autoLogout(accessData.token);
  }

  getCurrentUserId(): number | null {
    const currentUser = this.authSubject.value;
    return currentUser ? currentUser.id ?? null : null;
  }

  isAdmin(): Observable<boolean> {
    return this.user$.pipe(
      map(user => !!user && (user.roles?.some(role => role.roleType === 'ADMIN') ?? false))
    );
  }

  private storeUserData(token: string, user: iUser): void {
    localStorage.setItem('accessData', JSON.stringify({ token, user }));
  }

  errors(err: any) {
    console.log('Error received:', err);
    if (err.error && err.error.message) {
      switch (err.error.message) {
        case "Utente gia' esistente":
          return new Error('Username già esistente');
        case "Email gia' registrata":
          return new Error('Email già registrata');
        case "Email and Password are required":
          return new Error('Email e password obbligatorie');
        case "Email format is invalid":
          return new Error('Email scritta male');
        case "Invalid credentials":
          return new Error('Credenziali non valide');
        default:
          return new Error(err.error.message);
      }
    }
    if (err.error && err.error.errors) {
      return new Error(err.error.errors.join(', '));
    }
    return new Error(`Qualcosa è andato storto! Dettagli: ${err.message}`);
  }


}
