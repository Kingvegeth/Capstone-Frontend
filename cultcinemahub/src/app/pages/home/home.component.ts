import { Component } from '@angular/core';
import { UsersService } from '../../users.service';
import { iUser } from '../../models/iuser';
import { MovieService } from '../../services/movie.service';
import { iMovie } from '../../models/imovie';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  topRatedMovies: iMovie[] = [];

  constructor(private movieSvc: MovieService, private router: Router) { }

  ngOnInit(): void {
    this.loadTopRatedMovies();
  }

  loadTopRatedMovies(): void {
    this.movieSvc.getTopRatedMovies(5).subscribe(movies => {
      this.topRatedMovies = movies;
    });
  }

  goToMovieDetails(movieId: number | undefined): void {
    if (movieId) {
      this.router.navigate(['/movies', movieId]);
    } else {
      console.error('Movie ID is undefined.');
    }
  }

  getWidthByRating(rating: number | undefined): string {
    if (rating === undefined) {
      return '50%';
    }
    return `${rating * 10}%`;
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/img/default/default-movie.png';
  }
}
