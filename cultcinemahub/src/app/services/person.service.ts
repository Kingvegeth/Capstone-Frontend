import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { iPerson } from '../models/iperson';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  private personsUrl = environment.personsUrl;

  constructor(private http: HttpClient) { }

  getAllPeople(): Observable<iPerson[]> {
    return this.http.get<iPerson[]>(this.personsUrl);
  }

  getPersonById(id: number): Observable<iPerson> {
    return this.http.get<iPerson>(`${this.personsUrl}/${id}`);
  }

  createPerson(person: iPerson): Observable<iPerson> {
    return this.http.post<iPerson>(this.personsUrl, person);
  }

  updatePerson(id: number, person: iPerson): Observable<iPerson> {
    return this.http.put<iPerson>(`${this.personsUrl}/${id}`, person);
  }

  deletePerson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.personsUrl}/${id}`);
  }
}
