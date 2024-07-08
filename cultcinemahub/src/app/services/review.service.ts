import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { iReview } from '../models/ireview';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private reviewsUrl = environment.reviewsUrl;

  constructor(private http: HttpClient) { }

  getReviewsByMovieId(movieId: number): Observable<iReview[]> {
    return this.http.get<iReview[]>(`${this.reviewsUrl}/movie/${movieId}`);
  }

  createReview(review: iReview): Observable<iReview> {
    return this.http.post<iReview>(this.reviewsUrl, review);
  }

  updateReview(review: iReview): Observable<iReview> {
    return this.http.patch<iReview>(`${this.reviewsUrl}/${review.id}`, review);
  }

  deleteReview(reviewId: number): Observable<void> {
    return this.http.delete<void>(`${this.reviewsUrl}/${reviewId}`);
  }
}
