import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { iUser } from './Models/iuser';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { environment } from '../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  usersUrl = environment.usersUrl;

  usersArray: iUser[]=[]

  usersSubject = new BehaviorSubject<iUser[]>([]);

  $users = this.usersSubject.asObservable()

  constructor(private http:HttpClient){
    this.getAll().subscribe(data => {
      this.usersSubject.next(data)
      this.usersArray = data;
    })
  }



  getAll(){
    return this.http.get<iUser[]>(this.usersUrl)
  }

  getUserById(id: number): Observable<iUser> {
    const url = `${this.usersUrl}/${id}`;
    return this.http.get<iUser>(url);
  }

  updateUsersList(): void {
    this.getAll().subscribe(users => {
      this.usersSubject.next(users);
    });
  }



}
