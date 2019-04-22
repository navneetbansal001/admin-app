import { AuthGuard } from './guards/auth.guard';
import { OnBoardFormEditGuardGuard } from './guards/on-board-form-edit-guard.guard';
import { CanDeactivate, CanActivate } from '@angular/router';
import { StudentListComponent } from './student-list/student-list.component';
import { OnboardingformComponent } from './onboardingform/onboardingform.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
      { path: 'login', component: LoginComponent} ,
      {path: 'register', component: RegisterComponent },
      { path: 'home', component: HomeComponent},
      { path: 'onboardingform',
          canDeactivate :[OnBoardFormEditGuardGuard],
           canActivate : [AuthGuard] ,
          component: OnboardingformComponent},
      { path: 'studentlist', component: StudentListComponent , canActivate : [AuthGuard]},
      { path: 'students/:id/:flag/edit',
           canDeactivate :[OnBoardFormEditGuardGuard],
         component: OnboardingformComponent ,
       canActivate : [AuthGuard]},
       { path: 'students/:id/:flag/view',
         component: OnboardingformComponent ,
         canActivate : [AuthGuard]},
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: '**', redirectTo: 'login', pathMatch: 'full' } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
