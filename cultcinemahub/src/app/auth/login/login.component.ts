import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { iLoginData } from '../../models/ilogindata';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  loginData: iLoginData = {
    username: 'admin',
    password: 'password123'
  };

  rememberMe: boolean = false;
  errorMessage: string = '';

  constructor(
    private authSvc: AuthService,
    private router: Router
  ) {}

  signIn() {
    if (!this.loginData.username || !this.loginData.password) {
      this.errorMessage = 'Inserisci username e password.';
      return;
    }

    this.authSvc.login(this.loginData, this.rememberMe)
      .subscribe({
        next: (data) => {
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Errore durante il login:', error);
          this.errorMessage = 'Credenziali non valide. Riprova.';
        }
      });
  }
}
