import { ReviewService } from './../../services/review.service';
import { ChangeDetectorRef, Component, Renderer2 } from '@angular/core';
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
import { FastAverageColor } from 'fast-average-color';


@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss'
})
export class MovieDetailsComponent {
  movie: iMovie | undefined;
  currentUser!: iUser;
  newComments: { [reviewId: number]: Partial<iComment> } = {};
  private fac: FastAverageColor;


  genreTranslation: { [key: string]: string } = {
    ACTION: 'Azione',
    ADVENTURE: 'Avventura',
    ANIMATION: 'Animazione',
    BIOGRAPHY: 'Biografia',
    COMEDY: 'Commedia',
    CRIME: 'Poliziesco',
    DOCUMENTARY: 'Documentario',
    DRAMA: 'Drammatico',
    FANTASY: 'Fantasy',
    HORROR: 'Horror',
    MUSICAL: 'Musicale',
    SCI_FI: 'Fantascienza',
    THRILLER: 'Thriller'
  };

  constructor(
    private route: ActivatedRoute,
    private movieSvc: MovieService,
    private reviewSvc: ReviewService,
    private commentSvc: CommentService,
    private userSvc: UsersService,
    private modalService: NgbModal,
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef
  ) {
    this.fac = new FastAverageColor();
  }

  ngOnInit(): void {
    this.userSvc.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      this.getMovieDetails();
    });
  }

  getMovieDetails(): void {
    const id = +this.route.snapshot.paramMap.get('id')!;
    this.movieSvc.getMovieById(id).subscribe((movie: iMovie) => {
      this.movie = movie;
      this.setBackgroundColor(movie.posterImg);
      this.loadReviewsAndComments();
    });
  }

  loadReviewsAndComments(): void {
    this.movie?.reviews?.forEach(review => {
      this.reviewSvc.getReviewById(review.id!).subscribe(detailedReview => {
        const index = this.movie!.reviews!.findIndex(r => r.id === review.id);
        if (index !== -1) {
          this.movie!.reviews![index] = detailedReview;
          this.loadCommentsForReview(detailedReview);
        }
      });
    });
  }

  loadCommentsForReview(review: iReview): void {
    this.commentSvc.getCommentsByReviewId(review.id!).subscribe(comments => {
      review.comments = this.structureComments(comments);
      review.comments.forEach(comment => {
        this.loadRepliesForComment(comment);
      });
    });
  }

  loadRepliesForComment(comment: iComment): void {
    this.commentSvc.getCommentById(comment.id!).subscribe(detailedComment => {
      comment.replies = detailedComment.replies || [];
      comment.replies.forEach(reply => {
        this.loadRepliesForComment(reply); // Load nested replies
      });
    });
  }

  setBackgroundColor(imageUrl?: string): void {
    if (!imageUrl) {
      return;
    }

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;
    img.onload = () => {
      const color = this.fac.getColor(img);
      const movieDetailsWrapper = document.getElementById('movie-details-wrapper');
      if (movieDetailsWrapper) {
        this.renderer.setStyle(movieDetailsWrapper, 'background', `linear-gradient(to bottom, rgba(0, 0, 0, 1), ${color.hex})`);
      }
    };
  }


  structureComments(comments: iComment[]): iComment[] {
    const commentMap: { [key: number]: iComment } = {};
    const structuredComments: iComment[] = [];

    comments.forEach(comment => {
      comment.replies = comment.replies || [];
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
      this.updateAverageRating();
      this.cdr.detectChanges();
    });
  }

  updateAverageRating(): void {
    if (this.movie && this.movie.reviews && this.movie.reviews.length > 0) {
      const totalRating = this.movie.reviews.reduce((sum, review) => sum + (review.rating || 0), 0);
      const averageRating = totalRating / this.movie.reviews.length;
      this.movie.averageRating = Math.round(averageRating);
    }
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
      this.updateAverageRating();
      this.cdr.detectChanges();
    });
  }

  openAddCommentModal(reviewId?: number, parentId?: number) {
    console.log('Opening add comment modal for reviewId:', reviewId, 'and parentId:', parentId);
    const modalRef = this.modalService.open(AddCommentModalComponent);
    modalRef.componentInstance.reviewId = reviewId;
    modalRef.componentInstance.parentId = parentId;
    modalRef.componentInstance.commentAdded.subscribe((newComment: iComment) => {
      console.log('New comment added:', newComment);
      this.addCommentToReview(newComment);
      this.cdr.detectChanges();
    });
  }

  addCommentToReview(newComment: iComment): void {
    console.log('Attempting to add new comment:', newComment);

    if (newComment.parentId) {

      const review = this.movie?.reviews?.find(r =>
        r.comments?.some(c => c.id === newComment.parentId)
      );
      if (review) {
        console.log('Found review for new comment:', review);
        const parentComment = this.findCommentById(review.comments!, newComment.parentId);
        if (parentComment) {
          console.log('Found parent comment:', parentComment);
          parentComment.replies = parentComment.replies || [];
          parentComment.replies.push(newComment);
          console.log('Added new comment to parent comment replies:', parentComment.replies);
          this.cdr.detectChanges();
        } else {
          console.log('Parent comment not found for id:', newComment.parentId);
        }
      } else {
        console.log('Review not found for parent comment id:', newComment.parentId);
      }
    } else if (newComment.reviewId) {

      const review = this.movie?.reviews?.find(r => r.id === newComment.reviewId);
      if (review) {
        console.log('Found review for new comment:', review);
        review.comments = review.comments || [];
        review.comments.push(newComment);
        console.log('Added new comment to review comments:', review.comments);
        this.cdr.detectChanges();
      } else {
        console.log('Review not found for id:', newComment.reviewId);
      }
    } else {
      console.log('New comment has neither reviewId nor parentId:', newComment);
    }
  }



  openEditCommentModal(comment: iComment) {
    const modalRef = this.modalService.open(EditCommentModalComponent);
    modalRef.componentInstance.comment = comment;
    modalRef.componentInstance.commentUpdated.subscribe((updatedComment: iComment) => {
      this.updateComment(updatedComment);
    });
  }

  updateComment(updatedComment: iComment) {
    const review = this.movie?.reviews?.find(r => r.id === updatedComment.reviewId);
    if (review) {
      const originalComment = this.findCommentById(review.comments!, updatedComment.id);
      if (originalComment) {
        originalComment.body = updatedComment.body;
        originalComment.updatedAt = updatedComment.updatedAt;
      }
    }
  }

  onReplyComment(commentId: number) {
    console.log('Handling replyComment event with commentId:', commentId);

    const reviewId = this.movie?.reviews?.find(r => r.comments?.some(c => c.id === commentId))?.id;
    console.log('Found reviewId:', reviewId);
    if (reviewId !== undefined) {
      this.openAddCommentModal(reviewId, commentId);
    } else {
      console.log('Review not found for commentId:', commentId);
    }
  }


  deleteReview(reviewId: number): void {
    this.reviewSvc.deleteReview(reviewId).subscribe(() => {
      if (this.movie) {
        this.movie.reviews = this.movie.reviews?.filter(review => review.id !== reviewId);
        this.updateAverageRating();
        this.cdr.detectChanges();
      }
    }, (error) => {
      console.error('Error deleting review:', error);
    });

  }

  deleteComment(commentId: number): void {
    this.commentSvc.deleteComment(commentId).subscribe(
      () => {
        this.removeCommentFromReview(commentId);
      },
      (error) => {
        console.error('Error deleting comment:', error);
      }
    );
  }

  removeCommentFromReview(commentId: number): void {
    this.movie?.reviews?.forEach(review => {
      review.comments = this.removeCommentById(review.comments!, commentId);
    });
  }

  removeCommentById(comments: iComment[], commentId: number): iComment[] {
    return comments.filter(comment => {
      if (comment.id === commentId) {
        return false;
      }
      if (comment.replies) {
        comment.replies = this.removeCommentById(comment.replies, commentId);
      }
      return true;
    });
  }

  canAddReview(): boolean {
    if (!this.movie || !this.currentUser) return false;
    return !this.movie.reviews?.some(review => review.user?.id === this.currentUser.id);
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

  getGenres(): string[] {
    return this.movie?.genres?.map(genre => this.genreTranslation[genre]) || [];
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
