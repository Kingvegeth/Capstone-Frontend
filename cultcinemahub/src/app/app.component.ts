import { Component } from '@angular/core';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'cultcinemahub';
  isUserLoggedIn:boolean = false;
  isAdmin:boolean = false

  constructor(public authSvc: AuthService) {}

  ngOnInit() {
    this.authSvc.isLoggedIn$.subscribe(data => {
      this.isUserLoggedIn = data;
    });
    this.authSvc.user$.subscribe(user => {
      this.isAdmin = !!user && user.admin;

    });
  }

}
