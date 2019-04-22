import { User } from './../models/User';
import { Router } from '@angular/router';
import { AuthenticationService } from './../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { Input } from "@angular/core";
import { SimpleChanges, OnChanges } from "@angular/core";
import { SimpleChange } from "@angular/core";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title: string;
  isOnBoardRoute: boolean = true;
  @Input() isActive: boolean;

  currentUser: User;
  constructor(private authService : AuthenticationService, private router : Router) {
    debugger
  }

  ngOnInit() {
    this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    this.title = 'StudentOnBoardApplication';
  }

  ngOnChanges(changes: SimpleChanges) {
    const isActive: SimpleChange= changes.isActive;
    this.isOnBoardRoute = isActive.currentValue;
  }

  logOut(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
