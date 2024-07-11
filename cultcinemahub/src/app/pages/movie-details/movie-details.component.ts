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
import { AddReviewModalComponent } from '../../shared/modals/add-review-modal/add-review-modal.component';
import { EditReviewModalComponent } from '../../shared/modals/edit-review-modal/edit-review-modal.component';
import { AddCommentModalComponent } from '../../shared/modals/add-comment-modal/add-comment-modal.component';
import { EditCommentModalComponent } from '../../shared/modals/edit-comment-modal/edit-comment-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent {
  movie: iMovie | undefined;
  currentUser!: iUser; // Ensure currentUser is not undefined
  newComments: { [reviewId: number]: Partial<iComment> } = {};

  constructor(
    private route: ActivatedRoute,
    private movieSvc: MovieService,
    private reviewSvc: ReviewService,
    private commentSvc: CommentService,
    private userSvc: UsersService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.getMovieDetails();
    this.userSvc.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  getMovieDetails(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.movieSvc.getMovieById(id).subscribe((movie: iMovie) => {
      this.movie = movie;
      this.movie.reviews?.forEach(review => {
        this.newComments[review.id!] = {}; // Initialize newComments for each review
        this.reviewSvc.getReviewById(review.id!).subscribe(detailedReview => {
          const index = this.movie!.reviews!.findIndex(r => r.id === review.id);
          if (index !== -1) {
            this.movie!.reviews![index] = detailedReview;
          }
          this.loadCommentsForReview(detailedReview);
        });
      });
    });
  }

  loadCommentsForReview(review: iReview): void {
    this.commentSvc.getCommentsByReviewId(review.id!).subscribe(comments => {
      review.comments = this.structureComments(comments);
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

  openAddReviewModal() {
    const modalRef = this.modalService.open(AddReviewModalComponent);
    modalRef.componentInstance.movieId = this.movie?.id; // Pass the movieId to the modal
    modalRef.componentInstance.reviewAdded.subscribe((newReview: iReview) => {
      if (this.movie?.reviews) {
        this.movie.reviews.push(newReview);
      } else {
        this.movie!.reviews = [newReview];
      }
    });
  }

  openEditReviewModal(review: iReview) {
    const modalRef = this.modalService.open(EditReviewModalComponent);
    modalRef.componentInstance.review = review;
    modalRef.componentInstance.reviewUpdated.subscribe((updatedReview: iReview | null) => {
      if (updatedReview) {
        const index = this.movie!.reviews!.findIndex(r => r.id === updatedReview.id);
        if (index !== -1) {
          this.movie!.reviews![index] = updatedReview;
        }
      } else {
        this.movie!.reviews = this.movie!.reviews!.filter(r => r.id !== review.id);
      }
    });
  }

  openAddCommentModalForReview(reviewId: number) {
    if (reviewId !== undefined) {
      const modalRef = this.modalService.open(AddCommentModalComponent);
      modalRef.componentInstance.reviewId = reviewId;
      modalRef.componentInstance.commentAdded.subscribe((newComment: iComment) => {
        const review = this.movie?.reviews?.find(r => r.id === reviewId);
        if (review) {
          if (review.comments) {
            review.comments.push(newComment);
          } else {
            review.comments = [newComment];
          }
        }
      });
    }
  }

  openAddCommentModalForComment(commentId: number) {
    const modalRef = this.modalService.open(AddCommentModalComponent);
    modalRef.componentInstance.parentId = commentId;
    modalRef.componentInstance.commentAdded.subscribe((newComment: iComment) => {
      const review = this.movie?.reviews?.find(r => r.comments?.some(c => c.id === commentId));
      if (review) {
        const parentComment = this.findCommentById(review.comments!, commentId);
        if (parentComment?.replies) {
          parentComment.replies.push(newComment);
        } else {
          parentComment!.replies = [newComment];
        }
      }
    });
  }

  openEditCommentModal(comment: iComment) {
    const modalRef = this.modalService.open(EditCommentModalComponent);
    modalRef.componentInstance.comment = comment;
    modalRef.componentInstance.commentUpdated.subscribe((updatedComment: iComment) => {
      const review = this.movie?.reviews?.find(r => r.id === updatedComment.reviewId);
      if (review) {
        const originalComment = this.findCommentById(review.comments!, updatedComment.id);
        if (originalComment) {
          originalComment.body = updatedComment.body;
          originalComment.updatedAt = updatedComment.updatedAt;
        }
      }
    });
  }

  onReplyComment(commentId: number) {
    const reviewId = this.movie?.reviews?.find(r => r.comments?.some(c => c.id === commentId))?.id;
    if (reviewId !== undefined) {
      const modalRef = this.modalService.open(AddCommentModalComponent);
      modalRef.componentInstance.parentCommentId = commentId;
      modalRef.componentInstance.reviewId = reviewId;
      modalRef.componentInstance.commentAdded.subscribe((newComment: iComment) => {
        const review = this.movie?.reviews?.find(r => r.id === reviewId);
        if (review) {
          const parentComment = this.findCommentById(review.comments!, commentId);
          if (parentComment?.replies) {
            parentComment.replies.push(newComment);
          } else {
            parentComment!.replies = [newComment];
          }
        }
      });
    }
  }

  deleteReview(reviewId: number): void {
    this.reviewSvc.deleteReview(reviewId).subscribe(() => {
      if (this.movie) {
        this.movie.reviews = this.movie.reviews?.filter(review => review.id !== reviewId);
      }
    }, (error) => {
      console.error('Error deleting review:', error);
    });
  }

  deleteComment(commentId: number): void {
    this.commentSvc.deleteComment(commentId).subscribe(
      () => {
        this.movie?.reviews?.forEach(review => {
          review.comments = review.comments?.filter(c => c.id !== commentId);
        });
      },
      (error) => {
        console.error('Error deleting comment:', error);
      }
    );
  }


  onEditReview(review: iReview): void {
    this.openEditReviewModal(review);
  }

  onEditComment(comment: iComment): void {
    this.openEditCommentModal(comment);
  }

  onDeleteComment(commentId: number): void {
    this.deleteComment(commentId);
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

  getGenres(): string {
    return this.movie?.genres?.join(', ') || 'N/A';
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

  getAverageRating(): string {
    return this.movie?.averageRating !== undefined && this.movie?.averageRating > 0
      ? '★'.repeat(this.movie.averageRating)
      : 'Non ci sono ancora recensioni di questo film';
  }

  getStarRating(rating: number | undefined): number[] {
    return rating ? Array(rating).fill(0) : [];
  }
}
