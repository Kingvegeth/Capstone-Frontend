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

  getCommentById(id: number): Observable<iComment> {
    return this.http.get<iComment>(`${this.commentsUrl}/${id}`);
  }

  getCommentsByReviewId(reviewId: number): Observable<iComment[]> {
    return this.http.get<iComment[]>(`${this.commentsUrl}/review/${reviewId}`);
  }

  addComment(comment: Partial<iComment>): Observable<iComment> {
    return this.http.post<iComment>(this.commentsUrl, comment);
  }

  updateComment(comment: Partial<iComment>): Observable<iComment> {
    return this.http.put<iComment>(`${this.commentsUrl}/${comment.id}`, comment);
  }

  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(`${this.commentsUrl}/${commentId}`);
  }
}
