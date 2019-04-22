import { Subscription } from 'rxjs';
import { AlertService } from './../services/alert.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit, OnDestroy {

  private subscription: Subscription;
  message: any;

  constructor(private alertService: AlertService) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit() {
    this.subscription = this.alertService.getMessage().subscribe(message => {
    this.message = message;
    });
  }
}
