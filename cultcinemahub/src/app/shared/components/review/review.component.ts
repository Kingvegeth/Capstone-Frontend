import { Component, EventEmitter, Input, Output } from '@angular/core';
import { iReview } from '../../../models/ireview';
import { iComment } from '../../../models/icomment';
import { iUser } from '../../../models/iuser';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrl: './review.component.scss'
})
export class ReviewComponent {
  @Input() review!: iReview;
  @Input() currentUser?: iUser;
  @Output() addComment = new EventEmitter<number>();
  @Output() editReview = new EventEmitter<iReview>();
  @Output() deleteReview = new EventEmitter<number>();
  @Output() editComment = new EventEmitter<iComment>();
  @Output() deleteComment = new EventEmitter<{ commentId: number; reviewId: number }>();
  @Output() replyComment = new EventEmitter<number>();

  onAddComment() {
    this.addComment.emit(this.review.id);
  }

  onEditReview() {
    this.editReview.emit(this.review);
  }

  onDeleteReview() {
    this.deleteReview.emit(this.review.id);
  }

  onEditComment(comment: iComment) {
    this.editComment.emit(comment);
  }

  onDeleteComment(commentId: number) {
    this.deleteComment.emit({ commentId, reviewId: this.review.id! });
  }

  onReplyComment(commentId: number) {
    console.log('Emitting replyComment event with commentId:', commentId);
    this.replyComment.emit(commentId);
  }

  createdByCurrentUser(): boolean {
    return this.currentUser?.id === this.review.user?.id;
  }
}
