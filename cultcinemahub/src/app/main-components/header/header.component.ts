import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  scrolled:boolean = false;
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

  logout() {
    this.authSvc.logout();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.pageYOffset > 155) {
      this.scrolled = true;
    } else {
      this.scrolled = false;
    }
  }

}
