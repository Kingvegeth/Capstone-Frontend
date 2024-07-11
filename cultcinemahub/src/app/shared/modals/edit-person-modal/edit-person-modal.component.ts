import { Component, EventEmitter, Input, Output } from '@angular/core';
import { iPerson } from '../../../models/iperson';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonService } from '../../../services/person.service';

@Component({
  selector: 'app-edit-person-modal',
  templateUrl: './edit-person-modal.component.html',
  styleUrl: './edit-person-modal.component.scss'
})
export class EditPersonModalComponent {
  @Input() person!: iPerson;
  @Output() personUpdated = new EventEmitter<iPerson>();
  @Output() personDeleted = new EventEmitter<number>();

  constructor(
    public activeModal: NgbActiveModal,
    private personService: PersonService
  ) {}

  updatePerson() {
    this.personService.updatePerson(this.person.id, this.person).subscribe(
      (updatedPerson: iPerson) => {
        this.personUpdated.emit(updatedPerson);
        this.activeModal.close();
      },
      (error) => {
        console.error('Error updating person:', error);
      }
    );
  }

  deletePerson() {
    if (confirm('Are you sure you want to delete this person?')) {
      this.personService.deletePerson(this.person.id).subscribe(
        () => {
          this.personDeleted.emit(this.person.id);
          this.activeModal.close();
        },
        (error) => {
          console.error('Error deleting person:', error);
        }
      );
    }
  }
}
