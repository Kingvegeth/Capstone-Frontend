import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';


import { environment } from '../../environments/environment.development';
import { iMovie } from '../models/imovie';


@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private moviesUrl = environment.moviesUrl;

  constructor(private http: HttpClient) { }

  getAllMovies(): Observable<iMovie[]> {
    return this.http.get<iMovie[]>(this.moviesUrl).pipe(
      map(movies => movies.map(movie => ({
        ...movie,
        genresText: movie.genres.map(g => g).join(', ')
      })))
    );
  }

  getMovieById(id: number): Observable<iMovie> {
    return this.http.get<iMovie>(`${this.moviesUrl}/${id}`);
  }

  createMovie(movie: iMovie): Observable<iMovie> {
    return this.http.post<iMovie>(this.moviesUrl, movie);
  }

  updateMovie(id: number, movie: iMovie): Observable<iMovie> {
    return this.http.put<iMovie>(`${this.moviesUrl}/${id}`, movie);
  }

  patchMovie(id: number, movie: iMovie): Observable<iMovie> {
    return this.http.patch<iMovie>(`${this.moviesUrl}/${id}`, movie);
  }

  deleteMovie(id: number): Observable<void> {
    return this.http.delete<void>(`${this.moviesUrl}/${id}`);
  }

  uploadPoster(id: number, file: File): Observable<iMovie> {
    const formData = new FormData();
    formData.append('poster', file);
    return this.http.patch<iMovie>(`${this.moviesUrl}/${id}/poster`, formData);
  }
}
