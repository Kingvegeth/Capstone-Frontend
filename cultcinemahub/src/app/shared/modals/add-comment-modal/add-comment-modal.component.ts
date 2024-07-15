import { Component, EventEmitter, Input, Output } from '@angular/core';
import { iComment } from '../../../models/icomment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommentService } from '../../../services/comment.service';

@Component({
  selector: 'app-add-comment-modal',
  templateUrl: './add-comment-modal.component.html',
  styleUrls: ['./add-comment-modal.component.scss']
})
export class AddCommentModalComponent {
  @Output() commentAdded = new EventEmitter<iComment>();
  @Input() reviewId?: number;
  @Input() parentId?: number;
  newComment: Partial<iComment> = {};

  constructor(
    public activeModal: NgbActiveModal,
    private commentSvc: CommentService
  ) {}


ngOnInit(){
  console.log('AddCommentModal initialized with reviewId:', this.reviewId, 'and parentId:', this.parentId);
}


  addComment() {
    console.log('newComment.body:', this.newComment.body);
    console.log('parentId:', this.parentId);
    console.log('reviewId:', this.reviewId);

    if (!this.newComment.body) {
        console.error('Please fill all fields - Comment body is missing');
        return;
    }

    if (this.parentId === undefined && this.reviewId === undefined) {
        console.error('Please fill all fields - Both parentId and reviewId are missing');
        return;
    }

    const comment: Partial<iComment> = {
        body: this.newComment.body,
        parentId: this.parentId ? this.parentId : undefined,
        reviewId: this.reviewId ? this.reviewId : undefined,
        createdAt: new Date().toISOString()
    };

    console.log('Trying to send comment:', comment);

    this.commentSvc.addComment(comment).subscribe(
        (createdComment) => {
          console.log('New comment added to service:', createdComment);
            this.commentAdded.emit(createdComment);
            this.activeModal.close();
        },
        (error) => {
            console.error('Error creating comment:', error);
        }
    );
  }
}
