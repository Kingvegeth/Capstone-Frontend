import { Component, OnInit } from '@angular/core';
import { MovieService } from '../../services/movie.service';
import { iMovie } from '../../models/imovie';
import { debounceTime, Observable, Subject } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddMovieModalComponent } from '../../shared/modals/add-movie-modal/add-movie-modal.component';
import { Router } from '@angular/router';
import { EditMovieModalComponent } from '../../shared/modals/edit-movie-modal/edit-movie-modal.component';
import { iUser } from '../../models/iuser';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
export class MoviesComponent {
  movies: iMovie[] = [];
  isAdmin$!: Observable<boolean>;
  totalPages: number = 0;
  currentPage: number = 0;
  pageSize: number = 10;
  searchQuery: string = '';
  private searchSubject = new Subject<string>();

  constructor(
    private movieSvc: MovieService,
    private authSvc: AuthService,
    private modalSvc: NgbModal,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadMovies();
    this.isAdmin$ = this.authSvc.isAdmin();
    this.searchSubject.pipe(
      debounceTime(300)  // Aggiunge un ritardo di 300ms prima di inviare la richiesta
    ).subscribe(searchQuery => {
      this.loadMovies(0, searchQuery);
    });
  }

  loadMovies(page: number = 0, searchQuery: string = ''): void {
    this.movieSvc.getAllMovies(page, this.pageSize, searchQuery).subscribe(response => {
      this.movies = response.content;
      this.totalPages = response.totalPages;
      this.currentPage = page;
    });
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
    modalRef.componentInstance.movieDeleted.subscribe((deletedMovieId: number) => {
      this.movies = this.movies.filter(m => m.id !== deletedMovieId);
    });
  }

  goToMovieDetails(movieId: number | undefined) {
    if (movieId) {
      this.router.navigate(['/movies', movieId]);
    } else {
      console.error('Movie ID is undefined.');
    }
  }

  onPageChange(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.loadMovies(page);
    }
  }

  onSearch(): void {
    this.searchSubject.next(this.searchQuery);
  }
}
