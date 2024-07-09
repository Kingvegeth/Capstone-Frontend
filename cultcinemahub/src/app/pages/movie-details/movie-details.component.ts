import { ReviewService } from './../../services/review.service';
import { Component } from '@angular/core';
import { iMovie } from '../../models/imovie';
import { ActivatedRoute } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { AuthService } from '../../auth/auth.service';
import { iReview } from '../../models/ireview';
import { iUser } from '../../models/iuser';
import { UsersService } from '../../users.service';
import { iComment } from '../../models/icomment';
import { CommentService } from '../../services/comment.service';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent {
  movie: iMovie | undefined;
  newReview: Partial<iReview> = {};
  newComment: Partial<iComment> = {};
  hasReviewed: boolean = false;
  currentUser: iUser | undefined;

  constructor(
    private route: ActivatedRoute,
    private movieSvc: MovieService,
    private reviewSvc: ReviewService,
    private commentSvc: CommentService,
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
      userId: this.currentUser.id,
      movieId: this.movie.id,
      createdAt: new Date().toISOString()
    };


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

  addComment(reviewId: number, parentId: number | null = null): void {
    if (!this.newComment.body || !this.currentUser) {
      console.error('Please fill all fields');
      return;
    }

    const comment: Partial<iComment> = {
      body: this.newComment.body ?? '',
      user: this.currentUser,
      reviewId: reviewId,
      parentId: parentId,
      createdAt: new Date().toISOString()
    };

    this.commentSvc.addComment(comment).subscribe(
      (createdComment) => {
        const review = this.movie?.reviews?.find(r => r.id === reviewId);
        if (review) {
          if (parentId) {
            const parentComment = this.findCommentById(review.comments!, parentId);
            if (parentComment?.replies) {
              parentComment.replies.push(createdComment);
            } else {
              parentComment!.replies = [createdComment];
            }
          } else {
            if (review.comments) {
              review.comments.push(createdComment);
            } else {
              review.comments = [createdComment];
            }
          }
        }
        this.newComment = {};
      },
      (error) => {
        console.error('Error creating comment:', error);
      }
    );
  }

  findCommentById(comments: iComment[], commentId: number): iComment | undefined {
    for (const comment of comments) {
      if (comment.id === commentId) {
        return comment;
      }
      if (comment.replies) {
        const found = this.findCommentById(comment.replies, commentId);
        if (found) {
          return found;
        }
      }
    }
    return undefined;
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
