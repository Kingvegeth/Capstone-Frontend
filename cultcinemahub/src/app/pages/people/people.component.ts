import { Component, OnInit } from '@angular/core';
import { PersonService } from '../../services/person.service';
import { iPerson } from '../../models/iperson';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditPersonModalComponent } from '../../shared/edit-person-modal/edit-person-modal.component';
import { AddPersonModalComponent } from '../../shared/add-person-modal/add-person-modal.component';


@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {

  people: iPerson[] = [];

  constructor(private personService: PersonService, private modalService: NgbModal) { }

  ngOnInit(): void {
    this.loadPeople();
  }

  loadPeople(): void {
    this.personService.getAllPeople().subscribe(
      (data: iPerson[]) => {
        this.people = data;
      },
      (error) => {
        console.error('Error loading people:', error);
      }
    );
  }

  openAddPersonModal(): void {
    const modalRef = this.modalService.open(AddPersonModalComponent);
    modalRef.componentInstance.personAdded.subscribe((newPerson: iPerson) => {
      this.people.push(newPerson);
    });
  }

  openEditPersonModal(person: iPerson): void {
    const modalRef = this.modalService.open(EditPersonModalComponent);
    modalRef.componentInstance.person = person;
    modalRef.componentInstance.personUpdated.subscribe((updatedPerson: iPerson) => {
      const index = this.people.findIndex(p => p.id === updatedPerson.id);
      if (index !== -1) {
        this.people[index] = updatedPerson;
      }
    });
    modalRef.componentInstance.personDeleted.subscribe((deletedPersonId: number) => {
      this.people = this.people.filter(p => p.id !== deletedPersonId);
    });
  }

  deletePerson(id: number): void {
    if (confirm('Sei sicuro di voler eliminare questa persona?')) {
      this.personService.deletePerson(id).subscribe(() => {
        this.people = this.people.filter(person => person.id !== id);
      });
    }
  }
}
