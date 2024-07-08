import { ReviewService } from './../../services/review.service';
import { Component } from '@angular/core';
import { iMovie } from '../../models/imovie';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { AuthService } from '../../auth/auth.service';
import { iReview } from '../../models/ireview';
import { iUser } from '../../models/iuser';
import { UsersService } from '../../users.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent {
  movie: iMovie | undefined;
  newReview: Partial<iReview> = {};
  hasReviewed: boolean = false;
  currentUser: iUser | undefined;

  constructor(
    private route: ActivatedRoute,
    private movieSvc: MovieService,
    private reviewSvc: ReviewService,
    private userSvc: UsersService
  ) {}

  ngOnInit(): void {
    this.getMovieDetails();
    this.userSvc.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      this.checkIfReviewed();
    });
  }

  getMovieDetails(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.movieSvc.getMovieById(id).subscribe((movie: iMovie) => {
      console.log('Received movie data:', movie);
      this.movie = movie;
      this.checkIfReviewed();

      this.movie.reviews?.forEach(review => {
        this.reviewSvc.getReviewById(review.id!).subscribe(detailedReview => {
          const index = this.movie!.reviews!.findIndex(r => r.id === review.id);
          if (index !== -1) {
            this.movie!.reviews![index] = detailedReview;
            console.log('Detailed review received:', detailedReview);
          }
        });
      });
    });
  }

  getGenres(): string {
    return this.movie?.genres?.join(', ') || 'N/A';
  }

  checkIfReviewed(): void {
    if (this.currentUser && this.movie) {
      this.hasReviewed = this.movie.reviews?.some(review => review.user?.id === this.currentUser?.id) || false;
    }
  }


  addReview(): void {
    if (!this.newReview.title || !this.newReview.body || !this.newReview.rating || !this.currentUser || !this.movie) {
      console.error('Please fill all fields');
      return;
    }

    const review: Partial<iReview> = {
      title: this.newReview.title ?? '',
      body: this.newReview.body ?? '',
      rating: this.newReview.rating ?? 0,
      userId: this.currentUser.id,  // Passa solo l'ID dell'utente
      movieId: this.movie.id,  // Passa solo l'ID del film
      createdAt: new Date().toISOString()
    };

    // Aggiungi il log qui per visualizzare i dati della recensione
    console.log('Review data to be sent:', review);

    this.reviewSvc.createReview(review).subscribe(
      (createdReview) => {
        console.log('Created review:', createdReview);
        if (this.movie?.reviews) {
          this.movie.reviews.push(createdReview);
        } else {
          this.movie!.reviews = [createdReview];
        }
        this.newReview = {};
        this.hasReviewed = true;
      },
      (error) => {
        console.error('Error creating review:', error);
      }
    );
  }

onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'assets/img/default/default-movie.png';
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
}
