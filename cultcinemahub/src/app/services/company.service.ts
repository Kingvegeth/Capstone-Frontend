import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { iCompany } from '../models/icompany';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private companiesUrl = environment.companiesUrl;

  constructor(private http: HttpClient) {}

  getAllCompanies(): Observable<iCompany[]> {
    return this.http.get<iCompany[]>(this.companiesUrl);
  }

  getCompanyById(id: number): Observable<iCompany> {
    return this.http.get<iCompany>(`${this.companiesUrl}/${id}`);
  }

  createCompany(company: iCompany): Observable<iCompany> {
    return this.http.post<iCompany>(this.companiesUrl, company);
  }

  updateCompany(id: number, company: iCompany): Observable<iCompany> {
    return this.http.put<iCompany>(`${this.companiesUrl}/${id}`, company);
  }

  deleteCompany(id: number): Observable<void> {
    return this.http.delete<void>(`${this.companiesUrl}/${id}`);
  }
}
