import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { iUser } from '../../Models/iuser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  registerData: Partial<iUser> = {};

  constructor(
    private authSvc: AuthService,
    private router: Router
  ) { }

  signUp(): void {
    this.authSvc.register(this.registerData)
      .subscribe(data => {
        this.router.navigate(['/']);
      });
  }
}
