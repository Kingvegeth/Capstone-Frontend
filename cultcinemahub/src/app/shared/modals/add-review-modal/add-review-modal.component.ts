import { Component, EventEmitter, Input, Output } from '@angular/core';
import { iReview } from '../../../models/ireview';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ReviewService } from '../../../services/review.service';

@Component({
  selector: 'app-add-review-modal',
  templateUrl: './add-review-modal.component.html',
  styleUrl: './add-review-modal.component.scss'
})
export class AddReviewModalComponent {
  @Input() movieId!: number;
  @Output() reviewAdded = new EventEmitter<iReview>();
  newReview: Partial<iReview> = {};

  constructor(public activeModal: NgbActiveModal, private reviewService: ReviewService) {}

  addReview() {
    this.newReview.movieId = this.movieId;
    this.reviewService.createReview(this.newReview).subscribe(
      (createdReview) => {
        this.reviewAdded.emit(createdReview);
        this.activeModal.close();
      },
      (error) => {
        console.error('Error creating review:', error);
      }
    );
  }
}
