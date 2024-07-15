import { Component, EventEmitter, Input, Output } from '@angular/core';
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


  constructor(private commentService: CommentService) {}

  // replyToComment: { [commentId: number]: boolean } = {};
  // newComments: { [reviewId: number]: Partial<iComment> } = {};


  ngOnInit(): void {
    this.loadRepliesForComment(this.comment);
  }

  loadRepliesForComment(comment: iComment): void {
    if (comment.replies && comment.replies.length > 0) {
      comment.replies.forEach(reply => {
        this.commentService.getCommentById(reply.id!).subscribe(detailedComment => {
          reply.replies = detailedComment.replies || [];
        });
      });
    }
  }

  onReply(commentId: number) {
    console.log('Emitting reply event with commentId:', commentId);
    this.reply.emit(commentId);
  }

  onEditComment(comment: iComment) {
    this.editComment.emit(comment);
  }

  onDeleteComment(commentId: number) {
    this.deleteComment.emit(commentId);
  }

  // addReply(commentId: number) {
  //   console.log('Replying to comment:', commentId);
  //   this.reply.emit(commentId);
  // }

  createdByCurrentUser(): boolean {
    const result = this.currentUser?.id === this.comment.user?.id;
    return result;
  }
}
