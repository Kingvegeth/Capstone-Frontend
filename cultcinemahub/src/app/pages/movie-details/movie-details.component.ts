import { Component } from '@angular/core';
import { iMovie } from '../../models/imovie';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent {
  movie: iMovie | undefined;

  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService
  ) {}

  ngOnInit(): void {
    this.getMovieDetails();
  }

  getMovieDetails(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.movieService.getMovieById(id).subscribe((movie: iMovie) => {
      console.log('Received movie data:', movie);
      this.movie = movie;
    });
  }

  getGenres(): string {
    console.log(this.movie?.genres); // Aggiungi un log per il debug
    return this.movie?.genres.join(', ') || 'N/A';
  }

  getCast(): string {
    return this.movie?.cast?.map(person => `${person.firstName} ${person.lastName}`).join(', ') || 'N/A';
  }

  getDirectors(): string {
    return this.movie?.directors?.map(person => `${person.firstName} ${person.lastName}`).join(', ') || 'N/A';
  }

  getScreenwriters(): string {
    return this.movie?.screenwriters?.map(person => `${person.firstName} ${person.lastName}`).join(', ') || 'N/A';
  }

  getProducers(): string {
    return this.movie?.producers?.map(company => company.name).join(', ') || 'N/A';
  }

  getReviews(): string {
    return this.movie?.reviews?.map(review => `${review.body} - ${review.rating} stars`).join('<br>') || 'N/A';
  }

  getAverageRating(): string {
    return this.movie?.averageRating !== undefined && this.movie?.averageRating > 0
      ? '★'.repeat(this.movie.averageRating)
      : 'Non ci sono ancora recensioni di questo film';
  }

  getStarRating(rating: number | undefined): number[] {
    return rating ? Array(rating).fill(0) : [];
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/img/default/default-movie.png';
  }
}
