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
  replyToComment: iComment | undefined;
  editingComment: iComment | undefined;

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
          this.loadCommentsForReview(detailedReview);
        });
      });
    });
  }

  loadCommentsForReview(review: iReview): void {
    this.commentSvc.getCommentsByReviewId(review.id!).subscribe(comments => {
      review.comments = this.structureComments(comments);
      console.log('Loaded comments for review:', review);
    });
  }

  structureComments(comments: iComment[]): iComment[] {
    const commentMap: { [key: number]: iComment } = {};
    const structuredComments: iComment[] = [];

    comments.forEach(comment => {
      comment.replies = [];
      commentMap[comment.id] = comment;
      if (comment.parentId) {
        commentMap[comment.parentId]?.replies!.push(comment);
      } else {
        structuredComments.push(comment);
      }
    });

    return structuredComments;
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

  addComment(reviewId: number, parentId?: number): void {
    if (!this.newComment.body || !this.currentUser) {
        console.error('Please fill all fields');
        return;
    }

    const comment: Partial<iComment> = {
        body: this.newComment.body ?? '',
        userId: this.currentUser.id!,
        reviewId: reviewId,
        parentId: parentId ?? null,
        createdAt: new Date().toISOString()
    };

    console.log('Sending comment data:', comment);

    this.commentSvc.addComment(comment).subscribe(
        (createdComment) => {
            console.log('Created comment:', createdComment);
            const review = this.movie?.reviews?.find(r => r.id === reviewId);
            if (review) {
                if (createdComment.parentId) {
                    const parentComment = this.findCommentById(review.comments!, createdComment.parentId);
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
            this.replyToComment = undefined;
        },
        (error) => {
            console.error('Error creating comment:', error);
        }
    );
}

deleteComment(commentId: number, reviewId: number): void {
  this.commentSvc.deleteComment(commentId).subscribe(
    () => {
      const review = this.movie?.reviews?.find(r => r.id === reviewId);
      if (review) {
        review.comments = review.comments?.filter(c => c.id !== commentId);
      }
    },
    (error) => {
      console.error('Error deleting comment:', error);
    }
  );
}

removeCommentById(comments: iComment[], commentId: number): iComment[] {
  const filteredComments: iComment[] = [];
  comments.forEach(comment => {
    if (comment.id !== commentId) {
      comment.replies = this.removeCommentById(comment.replies!, commentId);
      filteredComments.push(comment);
    }
  });
  return filteredComments;
}

  addReply(comment: iComment): void {
    this.addComment(comment.reviewId!, comment.id);
  }

  setReplyToComment(comment: iComment): void {
    this.replyToComment = comment;
    this.newComment.body = '';
  }

  editComment(comment: iComment): void {
    this.editingComment = { ...comment }; // Crea una copia dell'oggetto commento
  }

  updateComment(comment: iComment): void {
    if (!comment.body || !this.currentUser) {
      console.error('Please fill all fields');
      return;
    }

    this.commentSvc.updateComment(comment).subscribe(
      (updatedComment) => {
        const review = this.movie?.reviews?.find(r => r.id === updatedComment.reviewId);
        if (review) {
          const originalComment = this.findCommentById(review.comments!, updatedComment.id);
          if (originalComment) {
            originalComment.body = updatedComment.body;
            originalComment.updatedAt = updatedComment.updatedAt;
          }
        }
        this.editingComment = undefined;
      },
      (error) => {
        console.error('Error updating comment:', error);
      }
    );
  }

  logCommentDetails(comment: iComment): void {
    console.log('Comment details:', comment);
  }

  logAllComments(): void {
    this.movie?.reviews?.forEach(review => {
      review.comments?.forEach(comment => {
        this.logCommentDetails(comment);
        if (comment.replies && comment.replies.length > 0) {
          this.logNestedComments(comment.replies);
        }
      });
    });
  }

  logNestedComments(comments: iComment[]): void {
    comments.forEach(comment => {
      this.logCommentDetails(comment);
      if (comment.replies && comment.replies.length > 0) {
        this.logNestedComments(comment.replies);
      }
    });
  }

  findCommentById(comments: iComment[], id: number): iComment | undefined {
    for (let comment of comments) {
      if (comment.id === id) {
        return comment;
      }
      if (comment.replies && comment.replies.length > 0) {
        const found = this.findCommentById(comment.replies, id);
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
