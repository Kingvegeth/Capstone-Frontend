import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';


import { environment } from '../../environments/environment.development';
import { iMovie } from '../models/imovie';
import { iPerson } from '../models/iperson';
import { iCompany } from '../models/icompany';


@Injectable({
  providedIn: 'root'
})
export class MovieService {

  private moviesUrl = environment.moviesUrl;

  constructor(private http: HttpClient) { }

  getAllMovies(page: number, size: number, searchQuery: string = ''): Observable<{ content: iMovie[], totalPages: number }> {
    return this.http.get<{ content: iMovie[], totalPages: number }>(`${this.moviesUrl}?page=${page}&size=${size}&search=${searchQuery}`).pipe(
      map(response => ({
        ...response,
        content: response.content.map(movie => ({
          ...movie,
          genresText: movie.genres.map(g => g).join(', ')
        }))
      }))
    );
  }

  getMovieById(id: number): Observable<iMovie> {
    return this.http.get<iMovie>(`${this.moviesUrl}/${id}`);
  }

  getTopRatedMovies(limit: number): Observable<iMovie[]> {
    return this.http.get<iMovie[]>(`${this.moviesUrl}/top-rated?limit=${limit}`);
  }

  createMovie(movie: iMovie): Observable<iMovie> {
    return this.http.post<iMovie>(this.moviesUrl, movie);
  }

  updateMovie(id: number, movie: any): Observable<iMovie> {
    const body = {
      title: movie.title,
      year: movie.year,
      duration: movie.duration,
      description: movie.description,
      genres: movie.genres,
      castIds: movie.cast.map((person: iPerson) => person.id),
      directorIds: movie.directors.map((person: iPerson) => person.id),
      screenwriterIds: movie.screenwriters.map((person: iPerson) => person.id),
      producerIds: movie.producers.map((company: iCompany) => company.id),
      distributorId: movie.distributor ? movie.distributor.id : null,
      posterImg: movie.posterImg
    };

    return this.http.put<iMovie>(`${this.moviesUrl}/${id}`, body);
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
