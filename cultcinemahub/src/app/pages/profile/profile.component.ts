import { Component, OnInit } from '@angular/core';
import { iUser } from '../../models/iuser';
import { UsersService } from '../../users.service';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  user: iUser = {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    avatar: '',
    roles: []
  };
  selectedFile: File | null = null;
  editMode: { [key: string]: boolean } = {
    firstName: false,
    lastName: false,
    username: false,
    email: false
  };

  constructor(private userSvc: UsersService, private authSvc: AuthService) {}

  ngOnInit() {
    this.userSvc.getCurrentUser().subscribe((data: iUser) => {
      this.user = data;
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    if (this.selectedFile) {
      this.userSvc.uploadAvatar(this.selectedFile).subscribe((response: iUser) => {
        this.user.avatar = response.avatar;
        this.authSvc.updateCurrentUser(response);
      });
    }
  }

  toggleEdit(field: string) {
    this.editMode[field] = !this.editMode[field];
  }

  confirmEdit(field: string) {
    this.userSvc.updateUser(this.user).subscribe((response: iUser) => {
      alert(`${field} aggiornato con successo!`);
      this.editMode[field] = false;
      this.authSvc.updateCurrentUser(response);
    });
  }

  resetEditMode() {
    for (let field in this.editMode) {
      this.editMode[field] = false;
    }
  }
}
