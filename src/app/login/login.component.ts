import { AlertService } from './../services/alert.service';
import { AuthenticationService } from './../services/authentication.service';
import { UserService } from './../services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private authenticationService: AuthenticationService,
        private alertService : AlertService) {
         }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required,Validators.email]],
            password: ['', Validators.required]
        });

        debugger
         localStorage.removeItem('currentUser');
         // reset login status
        this.authenticationService.logout();
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    login() {

        this.loading = true;

        this.authenticationService.login(this.f.email.value, this.f.password.value)
            .pipe(first())
            .subscribe(
            (data:any )=> {
                if(data && data.id)
                {
                this.alertService.success('Login is successful', true);
                this.router.navigate(['/onboardingform']);
                this.loading = true;
                }
                else{
                  this.alertService.error("login not successfull, either email or password is wrong");
                    this.loading = false;
                 }
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            }
            )
    }
}
