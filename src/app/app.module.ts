import { TokeninterceptorService } from './interceptors/tokeninterceptor.service';
import { fakeBackendProvider } from './interceptors/backend-interceptor.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { ReactiveFormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { HomeComponent } from './home/home.component';
import { OnboardingformComponent } from './onboardingform/onboardingform.component';
import { StudentListComponent } from './student-list/student-list.component';
import { AlertComponent } from './directives/alert.component';
import { HTTP_INTERCEPTORS } from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    LoginComponent,
    HomeComponent,
    OnboardingformComponent,
    StudentListComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
     { provide: HTTP_INTERCEPTORS, useClass: TokeninterceptorService, multi: true },
    fakeBackendProvider
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
