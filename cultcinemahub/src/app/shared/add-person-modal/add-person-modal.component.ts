import { Component, EventEmitter, Output } from '@angular/core';
import { iPerson } from '../../models/iperson';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-add-person-modal',
  templateUrl: './add-person-modal.component.html',
  styleUrl: './add-person-modal.component.scss'
})
export class AddPersonModalComponent {
  person: Partial<iPerson> = {};
  @Output() personAdded = new EventEmitter<iPerson>();

  constructor(public activeModal: NgbActiveModal, private personService: PersonService) { }

  addPerson(): void {
    if (!this.person.firstName || !this.person.lastName || !this.person.dateOfBirth) {
      console.error('Please fill all required fields');
      return;
    }

    this.personService.createPerson(this.person as iPerson).subscribe(
      (newPerson) => {
        this.personAdded.emit(newPerson);
        this.activeModal.close();
      },
      (error) => {
        console.error('Error creating person:', error);
      }
    );
  }
}
