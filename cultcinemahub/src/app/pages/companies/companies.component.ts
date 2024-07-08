import { Component } from '@angular/core';
import { iCompany } from '../../models/icompany';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CompanyService } from '../../services/company.service';
import { AddCompanyModalComponent } from '../../shared/add-company-modal/add-company-modal.component';
import { EditCompanyModalComponent } from '../../shared/edit-company-modal/edit-company-modal.component';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-companies',
  templateUrl: './companies.component.html',
  styleUrl: './companies.component.scss'
})
export class CompaniesComponent {
  companies: iCompany[] = [];
  isAdmin:boolean = false


  constructor(private companySvc: CompanyService, private authSvc: AuthService , private modalService: NgbModal) {}

  ngOnInit(): void {
    this.loadCompanies();
    this.authSvc.isAdmin().subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }

  loadCompanies() {
    this.companySvc.getAllCompanies().subscribe({
      next: (data: iCompany[]) => this.companies = data,
      error: (error) => console.error('Error fetching companies:', error)
    });
  }

  openAddCompanyModal() {
    const modalRef = this.modalService.open(AddCompanyModalComponent);
    modalRef.componentInstance.companyAdded.subscribe((newCompany: iCompany) => {
      this.companies.push(newCompany);
    });
  }

  openEditCompanyModal(company: iCompany) {
    const modalRef = this.modalService.open(EditCompanyModalComponent);
    modalRef.componentInstance.company = company;
    modalRef.componentInstance.companyUpdated.subscribe((updatedCompany: iCompany) => {
      const index = this.companies.findIndex(c => c.id === updatedCompany.id);
      if (index !== -1) {
        this.companies[index] = updatedCompany;
      }
    });
    modalRef.componentInstance.companyDeleted.subscribe((companyId: number) => {
      this.companies = this.companies.filter(c => c.id !== companyId);
    });
  }

  deleteCompany(companyId: number) {
    if (confirm('Are you sure you want to delete this company?')) {
      this.companySvc.deleteCompany(companyId).subscribe({
        next: () => this.companies = this.companies.filter(c => c.id !== companyId),
        error: (error) => console.error('Error deleting company:', error)
      });
    }
  }
}
