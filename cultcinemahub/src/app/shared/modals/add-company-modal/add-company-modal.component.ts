import { Component, EventEmitter, Output } from '@angular/core';
import { iCompany } from '../../../models/icompany';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CompanyService } from '../../../services/company.service';

@Component({
  selector: 'app-add-company-modal',
  templateUrl: './add-company-modal.component.html',
  styleUrl: './add-company-modal.component.scss'
})
export class AddCompanyModalComponent {
  company: Partial<iCompany> = {};

  @Output() companyAdded = new EventEmitter<iCompany>();

  constructor(public activeModal: NgbActiveModal, private companySvc: CompanyService) {}

  addCompany() {
    if (!this.company.name) {
      console.error('Please fill all required fields');
      return;
    }

    this.companySvc.createCompany(this.company as iCompany).subscribe(
      (newCompany) => {
        this.companyAdded.emit(newCompany);
        this.activeModal.close();
      },
      (error) => {
        console.error('Error creating company:', error);
      }
    );
  }
}
