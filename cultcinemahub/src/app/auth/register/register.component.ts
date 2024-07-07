import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { iUser } from '../../models/iuser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerData: Partial<iUser> = {};
  errorMessage: string = '';

  constructor(
    private authSvc: AuthService,
    private router: Router
  ) { }

  signUp(): void {
    this.authSvc.register(this.registerData)
      .subscribe({
        next: data => {
          this.router.navigate(['/']);
        },
        error: err => {
          console.error('Error during registration:', err);
          this.errorMessage = err.message;
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
  }
}
