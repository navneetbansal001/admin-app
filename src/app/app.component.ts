import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { User } from './models/User';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentUser : User;
  constructor(private  authService: AuthenticationService , private router: Router){
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
  }  
  title = 'StudentOnBoardApplication';
}
