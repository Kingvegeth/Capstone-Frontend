import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { iUser } from './models/iuser';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { environment } from '../environments/environment.development';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private usersUrl = environment.usersUrl;
  private usersSubject = new BehaviorSubject<iUser[]>([]);
  public $users = this.usersSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<iUser[]> {
    return this.http.get<iUser[]>(this.usersUrl);
  }

  getUserById(id: number): Observable<iUser> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get<iUser>(url);
  }

  getCurrentUser(): Observable<iUser> {
    const url = `${this.usersUrl}/me`;
    return this.http.get<iUser>(url).pipe(
      tap(user => console.log('Fetched current user:', user))
    );
  }

  updateUser(user: iUser): Observable<iUser> {
    const url = `${this.usersUrl}/edit`;
    return this.http.patch<iUser>(url, user);
  }

  uploadAvatar(file: File): Observable<iUser> {
    const formData = new FormData();
    formData.append('avatar', file);
    const url = `${this.usersUrl}/avatar`;
    return this.http.patch<iUser>(url, formData);
  }
}
