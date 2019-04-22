import { OnboardingformComponent } from './../onboardingform/onboardingform.component';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { CanDeactivate } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class OnBoardFormEditGuardGuard implements CanDeactivate<OnboardingformComponent> {
    canDeactivate(component: OnboardingformComponent) : Observable<boolean> | boolean {
      if(component.onBoardingForm.dirty && !component.onBoardingForm.valid)
      {
        return confirm(`Navigate away and lose all the changes to form`);
      }
      return true;
    }
}
