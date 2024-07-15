import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { iComment } from '../../../models/icomment';
import { iUser } from '../../../models/iuser';
import { CommentService } from '../../../services/comment.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
  @Input() comment!: iComment;
  @Input() currentUser?: iUser;
  @Output() reply = new EventEmitter<number>();
  @Output() editComment = new EventEmitter<iComment>();
  @Output() deleteComment = new EventEmitter<number>();


  constructor(private commentService: CommentService, private cdr: ChangeDetectorRef) {}


  ngOnInit(): void {
    console.log('Loading replies for comment:', this.comment);
    this.loadRepliesForComment(this.comment);
  }

  loadRepliesForComment(comment: iComment): void {
    comment.replies = comment.replies || [];
    if (comment.replies.length > 0) {
      comment.replies.forEach(reply => {
        this.commentService.getCommentById(reply.id!).subscribe(detailedComment => {
          reply.replies = detailedComment.replies || [];
          console.log('Loaded reply for comment:', reply);
          this.cdr.detectChanges();
        });
      });
    }
  }

  onReply(commentId: number) {
    this.reply.emit(commentId);
  }

  onEditComment(comment: iComment) {
    this.editComment.emit(comment);
  }

  onDeleteComment(commentId: number) {
    this.deleteComment.emit(commentId);
  }


  createdByCurrentUser(): boolean {
    const result = this.currentUser?.id === this.comment.user?.id;
    return result;
  }
}
