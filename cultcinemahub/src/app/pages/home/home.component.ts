import { Component } from '@angular/core';
import { UsersService } from '../../users.service';
import { iUser } from '../../models/iuser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(public userSvc: UsersService) {}

  ngOnInit() {
    this.userSvc.getAll().subscribe((users: iUser[]) => {
      console.log(users);
    });
  }



}
