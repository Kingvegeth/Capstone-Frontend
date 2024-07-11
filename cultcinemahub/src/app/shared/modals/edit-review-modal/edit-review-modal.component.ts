import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { iReview } from '../../../models/ireview';
import { ReviewService } from '../../../services/review.service';

@Component({
  selector: 'app-edit-review-modal',
  templateUrl: './edit-review-modal.component.html',
  styleUrl: './edit-review-modal.component.scss'
})
export class EditReviewModalComponent {
  @Input() review!: iReview;
  @Output() reviewUpdated = new EventEmitter<iReview | null>();
  isLoading = false;

  constructor(public activeModal: NgbActiveModal, private reviewService: ReviewService) {}

  updateReview() {
    this.isLoading = true;
    this.reviewService.updateReview(this.review).subscribe(
      updatedReview => {
        this.isLoading = false;
        this.reviewUpdated.emit(updatedReview);
        this.activeModal.close();
      },
      error => {
        console.error('Error updating review:', error);
        this.isLoading = false;
      }
    );
  }

  deleteReview() {
    if (confirm('Sei sicuro di voler eliminare questa recensione?')) {
      this.isLoading = true;
      this.reviewService.deleteReview(this.review.id!).subscribe(
        () => {
          this.isLoading = false;
          this.reviewUpdated.emit(null); // Emetti null quando la recensione viene eliminata
          this.activeModal.close();
        },
        error => {
          console.error('Error deleting review:', error);
          this.isLoading = false;
        }
      );
    }
  }
}
