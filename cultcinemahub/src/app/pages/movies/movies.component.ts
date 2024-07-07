import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { iMovie } from '../../models/imovie';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddMovieModalComponent } from '../../shared/add-movie-modal/add-movie-modal.component';
import { Router } from '@angular/router';
import { EditMovieModalComponent } from '../../shared/edit-movie-modal/edit-movie-modal.component';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent {
  movies: iMovie[] = [];
  isAdmin$!: Observable<boolean>;

  constructor(
    private movieSvc: MovieService,
    private authSvc: AuthService,
    private modalSvc: NgbModal,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.movieSvc.getAllMovies().subscribe((data: iMovie[]) => {
      this.movies = data;
    });

    this.isAdmin$ = this.authSvc.isAdmin();
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/img/default/default-movie.png';
  }

  getGenres(movie: iMovie): string {
    return movie.genres?.join(', ') || 'N/A';
  }

  openAddMovieModal() {
    const modalRef = this.modalSvc.open(AddMovieModalComponent);
    modalRef.componentInstance.movieAdded.subscribe((newMovie: iMovie) => {
      this.movies.push(newMovie);
    });
  }

  openEditMovieModal(movie: iMovie) {
    const modalRef = this.modalSvc.open(EditMovieModalComponent);
    modalRef.componentInstance.movie = movie;
    modalRef.componentInstance.movieUpdated.subscribe((updatedMovie: iMovie) => {
      const index = this.movies.findIndex(m => m.id === updatedMovie.id);
      if (index !== -1) {
        this.movies[index] = updatedMovie;
      }
    });
  }

  goToMovieDetails(movieId: number | undefined) {
    if (movieId) {
      this.router.navigate(['/movies', movieId]);
    } else {
      console.error('Movie ID is undefined.');
    }
  }
}