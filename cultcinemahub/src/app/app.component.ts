import { Component, HostListener } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'cultcinemahub';
  isHomepage = false;

  constructor(private router: Router){}

  ngOnInit(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHomepage = (event.urlAfterRedirects === '/' || event.urlAfterRedirects === '/home');
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const presentationElement = document.querySelector('.hero-wrapper') as HTMLElement;
    if (presentationElement) {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
      const bgPositionY = scrollTop * 0.2;
      presentationElement.style.backgroundPosition = `center -${bgPositionY}px`;
    }
  }

}
