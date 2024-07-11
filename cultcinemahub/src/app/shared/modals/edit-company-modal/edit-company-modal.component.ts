import { Component, EventEmitter, Input, Output } from '@angular/core';
import { iCompany } from '../../../models/icompany';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-edit-company-modal',
  templateUrl: './edit-company-modal.component.html',
  styleUrl: './edit-company-modal.component.scss'
})
export class EditCompanyModalComponent {
  @Input() company!: iCompany;
  @Output() companyUpdated = new EventEmitter<iCompany>();
  @Output() companyDeleted = new EventEmitter<number>();

  constructor(public activeModal: NgbActiveModal, private companySvc: CompanyService) {}

  updateCompany() {
    if (!this.company.name) {
      console.error('Please fill all required fields');
      return;
    }

    this.companySvc.updateCompany(this.company.id, this.company).subscribe(
      (updatedCompany) => {
        this.companyUpdated.emit(updatedCompany);
        this.activeModal.close();
      },
      (error) => {
        console.error('Error updating company:', error);
      }
    );
  }

  deleteCompany() {
    if (confirm('Are you sure you want to delete this company?')) {
      this.companySvc.deleteCompany(this.company.id).subscribe(
        () => {
          this.companyDeleted.emit(this.company.id);
          this.activeModal.close();
        },
        (error) => {
          console.error('Error deleting company:', error);
        }
      );
    }
  }
}
