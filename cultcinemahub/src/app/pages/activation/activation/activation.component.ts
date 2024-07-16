import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-activation',
  templateUrl: './activation.component.html',
  styleUrl: './activation.component.scss'
})
export class ActivationComponent {

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const token = params['token'];
      if (token) {
        this.activateAccount(token);
      } else {
        this.router.navigate(['/activation-error']);
      }
    });
  }

  activateAccount(token: string): void {
    this.http.get(`/api/users/activate?token=${token}`).subscribe({
      next: () => this.router.navigate(['/activation-success']),
      error: () => this.router.navigate(['/activation-error'])
    });
  }
}
