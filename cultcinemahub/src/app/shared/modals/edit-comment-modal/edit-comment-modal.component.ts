import { Component, EventEmitter, Input, Output } from '@angular/core';
import { iComment } from '../../../models/icomment';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-comment-modal',
  templateUrl: './edit-comment-modal.component.html',
  styleUrl: './edit-comment-modal.component.scss'
})
export class EditCommentModalComponent {
  @Input() comment!: iComment;
  @Output() commentUpdated = new EventEmitter<iComment>();

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit() {
    console.log("edit comment modal");


  }

  updateComment() {
    this.commentUpdated.emit(this.comment);
    this.activeModal.close();
  }
}
