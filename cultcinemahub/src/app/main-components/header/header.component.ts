import { Component, HostListener } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { UsersService } from '../../users.service';
import { iUser } from '../../models/iuser';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  scrolled: boolean = false;
  isUserLoggedIn: boolean = false;
  isAdmin: boolean = false;
  currentUser: iUser | null = null;

  constructor(
    public authSvc: AuthService,
    private userSvc: UsersService
  ) {}

  ngOnInit() {
    this.authSvc.isLoggedIn$.subscribe(data => {
      this.isUserLoggedIn = data;
      if (this.isUserLoggedIn) {
        this.loadCurrentUser();
      } else {
        this.currentUser = null;
      }
    });

    this.authSvc.isAdmin().subscribe(isAdmin => {
      this.isAdmin = isAdmin;
    });
  }

  loadCurrentUser() {
    this.userSvc.getCurrentUser().subscribe(user => {
      this.currentUser = user;
    });
  }

  logout() {
    this.authSvc.logout();
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.scrollY > 155) {
      this.scrolled = true;
    } else {
      this.scrolled = false;
    }
  }
}
