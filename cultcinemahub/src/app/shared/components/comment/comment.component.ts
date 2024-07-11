import { Component, EventEmitter, Input, Output } from '@angular/core';
import { iComment } from '../../../models/icomment';
import { iUser } from '../../../models/iuser';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent {
  @Input() comment!: iComment;
  @Input() currentUser!: iUser;
  @Output() reply = new EventEmitter<number>();
  @Output() editComment = new EventEmitter<iComment>();
  @Output() deleteComment = new EventEmitter<number>();

  replyToComment: { [commentId: number]: boolean } = {};
  newComments: { [reviewId: number]: Partial<iComment> } = {};

  ngOnInit() {
    console.log('CommentComponent initialized with comment:', this.comment);
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

  addReply(commentId: number) {
    console.log('Replying to comment:', commentId);
    this.reply.emit(commentId);
  }
}
