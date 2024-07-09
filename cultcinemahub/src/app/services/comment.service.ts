import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { iComment } from '../models/icomment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private commentsUrl = environment.commentsUrl;

  constructor(private http: HttpClient) {}

  addComment(comment: Partial<iComment>): Observable<iComment> {
    return this.http.post<iComment>(this.commentsUrl, comment);
  }
}
